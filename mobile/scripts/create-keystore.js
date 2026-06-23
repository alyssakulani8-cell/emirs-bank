const fs = require('fs');
const path = require('path');
const forge = require('node-forge');

// Generate a self-signed certificate for Android keystore
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
  { name: 'organizationalUnitName', value: 'Mobile Development' },
  { name: 'countryName', value: 'US' },
  { name: 'stateOrProvinceName', value: 'GA' },
  { name: 'localityName', value: 'Atlanta' }
];
cert.setSubject(attrs);
cert.setIssuer(attrs);

cert.setExtensions([
  { name: 'basicConstraints', cA: true },
  { name: 'keyUsage', keyCertSign: true, digitalSignature: true, keyEncipherment: true },
  { name: 'subjectKeyIdentifier' }
]);

cert.sign(keys.privateKey, forge.md.sha256.create());

console.log('Creating PKCS12 keystore...');
const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
  keys.privateKey,
  [cert],
  'android', // password
  { generateLocalKeyId: true, friendlyName: 'ameris-global-alias' }
);

const p12Der = forge.asn1.toDer(p12Asn1).getBytes();

const p12Path = path.join(__dirname, '..', 'keystore.p12');
fs.writeFileSync(p12Path, Buffer.from(p12Der, 'binary'));
console.log('PKCS12 keystore created at:', p12Path);

// Also extract PEM files for reference
const pemPath = path.join(__dirname, '..', 'keystore.pem');
const pem = forge.pki.privateKeyToPem(keys.privateKey) + '\n' + forge.pki.certificateToPem(cert);
fs.writeFileSync(pemPath, pem);
console.log('PEM file created at:', pemPath);

// Create a simple keystore.info file
const info = {
  keystorePassword: 'android',
  keyPassword: 'android',
  keyAlias: 'ameris-global-alias'
};
fs.writeFileSync(
  path.join(__dirname, '..', 'keystore.json'),
  JSON.stringify(info, null, 2)
);
console.log('Keystore info created');
