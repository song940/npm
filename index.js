const xttp = require('xttp');
/**
 * [NPM description]
 * @param {[type]} options [description]
 */
function NPM(options) {
  if (!(this instanceof NPM))
    return new NPM(options);
  return Object.assign(this, {
    registry: 'http://registry.npmjs.org'
  }, options);
}

/**
 * [getPackage description]
 * @param  {[type]} name    [description]
 * @param  {[type]} version [description]
 * @return {[type]}         [description]
 */
NPM.prototype.fetch = function (name, version = '') {
  const { registry } = this;
  return xttp
    .get(`${registry}/${name}/${version}`)
    .then(res => res.json())
    .then(package => package.name && package);
};

/**
 * [Server description]
 * @type {[type]}
 */
NPM.Proxy = require('./proxy');
NPM.Server = require('./server');
NPM.Storage = require('./storage');
NPM.createServer = function (options) {
  return new NPM.Server(options);
};

module.exports = NPM;