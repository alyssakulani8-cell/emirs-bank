const https = require('https');
const fs = require('fs');
const path = require('path');
const state = JSON.parse(fs.readFileSync(path.join(require('os').homedir(), '.expo', 'state.json'), 'utf8'));
const session = JSON.parse(state.auth.sessionSecret);
const cookie = 'expo-session=' + JSON.stringify(session);

const query = JSON.stringify({ query: `
  query AppQuery {
    app {
      byFullName(fullName: "@chka_dibia/ameris-global-mobile") {
        id
        androidAppCredentials {
          id
          keystore {
            id
          }
        }
      }
    }
  }
` });

const opts = {
  hostname: 'exp.host',
  path: '/--/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': cookie,
    'User-Agent': 'EAS-CLI'
  }
};

const req = https.request(opts, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    const parsed = JSON.parse(data);
    const app = parsed.data?.app?.byFullName;
    console.log('App ID:', app?.id);
    const creds = app?.androidAppCredentials;
    console.log('Credentials:', JSON.stringify(creds, null, 2));
  });
});
req.write(query);
req.end();
