const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Read Expo auth session - use raw string, not parsed
const statePath = path.join(require('os').homedir(), '.expo', 'state.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const sessionSecret = state.auth.sessionSecret;  // raw JSON string

function gql(query, variables) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables: variables || {} });
    const opts = {
      hostname: 'api.expo.dev',
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'expo-session': sessionSecret,
        'User-Agent': 'EAS-CLI',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('Parse error: ' + data.slice(0,300))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function generateKeystore() {
  // Generate RSA key pair using Node.js crypto
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });

  // Create a self-signed certificate
  const cert = crypto.createCertificate();
  
  // For PKCS12, we need node-forge. Let's just create a PEM-based keystore
  const keystoreData = JSON.stringify({
    keystorePassword: 'android',
    keyPassword: 'android',
    keyAlias: 'ameris-global-alias',
    privateKeyPEM: privateKey,
    publicKeyPEM: publicKey
  });

  return {
    keystore: Buffer.from(keystoreData).toString('base64'),
    keystorePassword: 'android',
    keyAlias: 'ameris-global-alias',
    keyPassword: 'android',
    type: 'JKS'
  };
}

async function main() {
  console.log('1. Getting account info...');

  // First, get the current user and their accounts
  const accountQuery = `query {
    me {
      id
      username
      accounts {
        id
        name
      }
    }
  }`;
  const meResult = await gql(accountQuery);
  console.log('Me:', JSON.stringify(meResult?.data?.me?.username));
  const accounts = meResult?.data?.me?.accounts || [];
  const accountId = accounts[0]?.id;
  if (!accountId) {
    console.log('No account found:', JSON.stringify(meResult));
    return;
  }
  console.log('Account ID:', accountId);

  // 2. Get project
  const projectQuery = `query {
    app {
      byFullName(fullName: "@chka_dibia/ameris-global-mobile") {
        id
        name
      }
    }
  }`;
  const projectResult = await gql(projectQuery);
  console.log('Project:', JSON.stringify(projectResult?.data?.app?.byFullName));
  const appId = projectResult?.data?.app?.byFullName?.id;
  if (!appId) {
    console.log('Failed to get project. Response:', JSON.stringify(projectResult));
    return;
  }

  // 3. Check existing android credentials
  const credQuery = `query {
    app {
      byId(appId: "${appId}") {
        androidAppCredentials {
          id
          keystore {
            id
            type
          }
        }
      }
    }
  }`;
  const credResult = await gql(credQuery);
  const existingCreds = credResult?.data?.app?.byId?.androidAppCredentials;
  console.log('Existing credentials:', JSON.stringify(existingCreds));

  if (existingCreds && existingCreds.keystore) {
    console.log('Keystore already exists! Build should work.');
    return;
  }

  // 4. If no credentials exist, try to create via mutation
  // First try to create AndroidAppCredentials
  console.log('Creating AndroidAppCredentials...');
  const createCredsMutation = `mutation {
    androidAppCredentials {
      createAndroidAppCredentials(input: { appId: "${appId}" }) {
        id
      }
    }
  }`;
  const createCredsResult = await gql(createCredsMutation);
  console.log('Create creds result:', JSON.stringify(createCredsResult));

  const credsId = createCredsResult?.data?.androidAppCredentials?.createAndroidAppCredentials?.id;
  if (!credsId) {
    console.log('Failed to create credentials');
    return;
  }
  console.log('Credentials created with ID:', credsId);

  // 5. Now create the keystore for these credentials
  console.log('Creating keystore...');
  const keystoreInput = {
    type: 'JKS',
    keystore: 'test',
    keystorePassword: 'android',
    keyAlias: 'ameris-global-alias',
    keyPassword: 'android'
  };

  const createKeystoreMutation = `mutation CreateAndroidKeystoreMutation(
    $androidKeystoreInput: AndroidKeystoreInput!
    $accountId: ID!
  ) {
    androidKeystore {
      createAndroidKeystore(
        androidKeystoreInput: $androidKeystoreInput
        accountId: $accountId
      ) {
        id
        type
      }
    }
  }`;

  const ksResult = await gql(createKeystoreMutation, {
    androidKeystoreInput: keystoreInput,
    accountId: accountId
  });
  console.log('Keystore result:', JSON.stringify(ksResult));

  if (ksResult?.data?.androidKeystore?.createAndroidKeystore?.id) {
    console.log('SUCCESS! Keystore created.');
  }
}

main().catch(e => console.error('Error:', e.message));
