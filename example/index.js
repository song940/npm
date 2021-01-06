const path = require('path');
const { info, resolve } = require('..');

const k = async pkg => { 
  const children = [];
  const { dependencies = {} } = pkg;
  for (const [name, version] of Object.entries(dependencies)) {
    const p = await resolve(name, version);
    p.parent = pkg;
    p.children = await k(p);
    console.log(p.name, p.version);
    children.push(p);
  }
  return children;
};

const install = async () => {
  const root = process.cwd();
  const pkgfile = path.join(root, 'package.json');
  const pkg = require(pkgfile);
  const tree = await k(pkg);
  console.log('tree', tree);
};

install();