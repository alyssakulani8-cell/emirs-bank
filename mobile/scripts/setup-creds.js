const https = require('https');
const fs = require('fs');
const path = require('path');

// Read Expo auth session
const statePath = path.join(require('os').homedir(), '.expo', 'state.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const session = JSON.parse(state.auth.sessionSecret);
const cookie = 'expo-session=' + JSON.stringify(session);

// First get the app ID
function graphql(query, vars) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables: vars || {} });
    const opts = {
      hostname: 'exp.host',
      path: '/--/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
        'User-Agent': 'EAS-CLI',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error(data.slice(0,200))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  // 1. Get app by full name
  const appQuery = `query {
    app { byFullName(fullName: "@chka_dibia/ameris-global-mobile") { id name slug } }
  }`;
  const appResult = await graphql(appQuery);
  const appId = appResult?.data?.app?.byFullName?.id;
  if (!appId) {
    console.log('App not found:', JSON.stringify(appResult));
    return;
  }
  console.log('App ID:', appId);

  // 2. Check existing android credentials
  const credQuery = `query {
    app { byId(appId: "${appId}") {
      androidAppCredentials { id keystore { id } }
    }}
  }`;
  const credResult = await graphql(credQuery);
  const creds = credResult?.data?.app?.byId?.androidAppCredentials;
  console.log('Existing credentials:', JSON.stringify(creds));

  if (creds && creds.keystore) {
    console.log('Keystore already exists! Build should work without --freeze-credentials');
    return;
  }

  // 3. Create keystore via API
  console.log('No keystore found. Need to create one...');
  console.log('Creating keystore via mutation...');

  // Try to create keystore using the createAndroidAppCredentials mutation
  const createMutation = `mutation {
    androidAppCredentials {
      createAndroidAppCredentials(input: {
        appId: "${appId}"
      }) {
        id
        keystore {
          id
        }
      }
    }
  }`;

  try {
    const createResult = await graphql(createMutation);
    console.log('Create result:', JSON.stringify(createResult, null, 2));
  } catch(e) {
    console.error('GraphQL error:', e.message);
  }
}

main().catch(console.error);
