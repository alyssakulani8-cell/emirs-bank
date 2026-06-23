const https = require('https');
const fs = require('fs');
const path = require('path');
const forge = require('node-forge');

const statePath = path.join(require('os').homedir(), '.expo', 'state.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const sessionSecret = state.auth.sessionSecret;

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
        catch(e) { reject(new Error(data.slice(0,300))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function generateP12Keystore() {
  console.log('Generating RSA key pair...');
  const keys = forge.pki.rsa.generateKeyPair(2048);

  console.log('Creating certificate...');
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 30);

  const attrs = [
    { name: 'commonName', value: 'Ameris Global' },
    { name: 'organizationName', value: 'Ameris Global' },
    { name: 'countryName', value: 'US' }
  ];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.sign(keys.privateKey, forge.md.sha256.create());

  console.log('Creating PKCS12...');
  const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
    keys.privateKey, [cert],
    'android',
    { generateLocalKeyId: true, friendlyName: 'ameris-global-alias' }
  );
  const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
  const base64 = Buffer.from(p12Der, 'binary').toString('base64');
  return {
    base64EncodedKeystore: base64,
    keystorePassword: 'android',
    keyAlias: 'ameris-global-alias',
    keyPassword: 'android',
    type: 'PKCS12'
  };
}

async function main() {
  const appId = '264d4d73-3bfc-48bc-907a-25a6c267b4f0';
  const accountId = 'b1576189-e746-4c9b-b688-2374e4879584'; // from earlier run
  const packageName = 'com.amerisglobal.mobile';

  // Step 1: Create AndroidAppCredentials
  console.log('\n=== Step 1: Create AndroidAppCredentials ===');
  const credsMutation = `mutation CreateAndroidAppCredentialsMutation(
    $androidAppCredentialsInput: AndroidAppCredentialsInput!
    $appId: ID!
    $applicationIdentifier: String!
  ) {
    androidAppCredentials {
      createAndroidAppCredentials(
        androidAppCredentialsInput: $androidAppCredentialsInput
        appId: $appId
        applicationIdentifier: $applicationIdentifier
      ) { id }
    }
  }`;

  let credsResult = await gql(credsMutation, {
    androidAppCredentialsInput: {},
    appId: appId,
    applicationIdentifier: packageName
  });

  let credsId = credsResult?.data?.androidAppCredentials?.createAndroidAppCredentials?.id;
  if (!credsId) {
    console.log('Create creds failed:', JSON.stringify(credsResult));
    // Maybe it already exists, try to find it
    const findQuery = `query {
      app { byId(appId: "${appId}") {
        androidAppCredentials { id }
      }}
    }`;
    const findResult = await gql(findQuery);
    const credsArray = findResult?.data?.app?.byId?.androidAppCredentials;
    credsId = Array.isArray(credsArray) ? credsArray[0]?.id : credsArray?.id;
    if (!credsId) {
      console.log('Cannot find or create credentials:', JSON.stringify(findResult));
      return;
    }
    console.log('Found existing credentials:', credsId);
  } else {
    console.log('Created credentials:', credsId);
  }

  // Step 2: Create Keystore
  console.log('\n=== Step 2: Create Keystore ===');
  const keystoreInput = generateP12Keystore();
  console.log('Keystore generated, size:', keystoreInput.base64EncodedKeystore.length, 'bytes');

  const ksMutation = `mutation CreateAndroidKeystoreMutation(
    $androidKeystoreInput: AndroidKeystoreInput!
    $accountId: ID!
  ) {
    androidKeystore {
      createAndroidKeystore(
        androidKeystoreInput: $androidKeystoreInput
        accountId: $accountId
      ) { id type }
    }
  }`;

  const ksResult = await gql(ksMutation, {
    androidKeystoreInput: keystoreInput,
    accountId: accountId
  });

  const keystoreId = ksResult?.data?.androidKeystore?.createAndroidKeystore?.id;
  if (!keystoreId) {
    console.log('Create keystore failed:', JSON.stringify(ksResult));
    return;
  }
  console.log('Created keystore:', keystoreId);

  // Step 3: Create Build Credentials and link keystore
  console.log('\n=== Step 3: Create Build Credentials ===');
  const bcMutation = `mutation CreateBuildCredentialsMutation(
    $input: AndroidAppBuildCredentialsInput!
    $androidAppCredentialsId: ID!
  ) {
    androidAppBuildCredentials {
      createAndroidAppBuildCredentials(
        androidAppBuildCredentialsInput: $input
        androidAppCredentialsId: $androidAppCredentialsId
      ) { id }
    }
  }`;

  const bcResult = await gql(bcMutation, {
    input: { name: 'Build Credentials default', isDefault: true, keystoreId: keystoreId },
    androidAppCredentialsId: credsId
  });

  const bcId = bcResult?.data?.androidAppBuildCredentials?.createAndroidAppBuildCredentials?.id;
  if (!bcId) {
    console.log('Create build credentials failed:', JSON.stringify(bcResult));
    return;
  }
  console.log('SUCCESS! All credentials set up correctly.');
  console.log('Now build without --freeze-credentials');
}

main().catch(e => console.error('Error:', e.message));
