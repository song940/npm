const util         = require('util');
const http         = require('http');
const EventEmitter = require('events');

const kelp     = require('kelp');
const body     = require('kelp-body');
const send     = require('kelp-send');
const route    = require('kelp-route');
const logger   = require('kelp-logger');

function Server({ registry }){
  const app = kelp();
  app.use(logger);
  app.use(send);
  app.use(body);
  app.use(route('get', '/', (req, res) => res.end('upkg-server')));
  app.use(route('get', '/:name/:version?', async (req, res, next) => {
    let { name, version } = req.params;
    // 1. get package meta from registry
    const package = await registry.fetch(name, version);
    if(!package) return res.status(404).send(`${name} not found`);
    res.send(package);
  }));
  app.use(route('get', '/:name/-/:filename', async (req, res) => {
    const { name, filename } = req.params;
    (await registry.getFileStream(name, filename)).pipe(res);
  }));
  app.use(route('put', '/:name', async (req, res) => {
    // npm publish
    const pkg = req.body;
    res.send(await registry.publish(pkg));
  }));
  // user api
  app.use(route('put', '/-/user/:id', async (req, res) => {
    const user = req.body;
    user.token = Buffer.from(`${user.name}:${user.password}`).toString('base64');
    res.status(201).send(user);
  }));
  app.use((req, res) => res.send(404));
  return http.createServer(app);
};

module.exports = Server;