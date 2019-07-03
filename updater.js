const semver = require('semver');
const npm    = require('.')({
  timeout : 3000,
  registry: 'https://registry.npmjs.org'
});

module.exports = function(pkg){
  npm.fetch(pkg.name).then(package => {
    const current = pkg.version;
    const latest = package[ 'dist-tags' ][ 'latest' ];
    const type = diff(current, latest);
    if(pkg.updater && pkg.updater.level == type){
      console.warn(color('[upkg-updater] %s %s is available! (you\'re using %s)', 35), pkg.name, latest, current);
      console.warn(color('[upkg-updater] To upgrade, run "npm upgrade %s"', 35), pkg.name);
    }
  }, () => {});
};

function diff(a, b){
  if (semver.gt(a, b)) {
    return null;
  }

  a = semver.parse(a);
  b = semver.parse(b);

  for (var key in a) {
    if (key === 'major' || key === 'minor' || key === 'patch') {
      if (a[key] !== b[key]) {
        return key;
      }
    }

    if (key === 'prerelease' || key === 'build') {
      if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
        return key;
      }
    }
  }

  return null;
}

function color(str, c){
  return "\x1b[" + c + "m" + str + "\x1b[0m";
};