const npm = require('..');

const storage = new npm.Storage({ dir: '/tmp/bb' })

const proxy = new npm.Proxy({
  registry: npm(), storage
});

proxy.fetch('kelp').then(package => {
  console.log(package.name, package['dist-tags'][ 'latest' ]);
})