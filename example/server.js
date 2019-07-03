const npm = require('..');

const storage = new npm.Storage({ dir: '/tmp' })

const proxy = new npm.Proxy({
  registry: npm(), storage
});

const server = npm.createServer({ 
  // registry: npm(),
  registry: proxy,
})

server.listen(4000);