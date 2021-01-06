const https = require('https');
const semver = require('semver');
const { debuglog } = require('util');

const debug = debuglog('upkg:client');

const get = url => new Promise(done => https.get(url, done));

const readStream = stream => new Promise((resolve, reject) => {
  const buf = [];
  stream
    .on('error', reject)
    .on('data', chunk => buf.push(chunk))
    .on('end', () => resolve(Buffer.concat(buf)));
});

const info = async name => {
  debug('info', name);
  return Promise
    .resolve()
    .then(() => get(`https://registry.npmjs.org/${name}`))
    .then(readStream)
    .then(JSON.parse)
};

const resolve = async (name, version = 'latest') => {
  const pkg = await info(name);
  const versions = Object.keys(pkg.versions);
  version = pkg['dist-tags'][version] || version;
  version = version in versions ? version : semver.maxSatisfying(versions, version);
  return pkg.versions[version];
};

module.exports = {
  info,
  resolve,
};