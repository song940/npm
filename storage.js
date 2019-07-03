const fs = require('fs');
const path = require('path');
const util = require('util');
const mkdirp = require('mkdirp');

class Storage {
  constructor(options) {
    this.options = options;
  }
  async fetch(name, version) {
    const { dir } = this.options;
    const filename = path.join(dir, name, name + '.json');
    const readFile = util.promisify(fs.readFile);
    const exists = filename => {
      try {
        fs.accessSync(filename);
        return true;
      } catch(e) {
        return false;
      }
    }
    if(!exists(filename)) return;
    const content = await readFile(filename, 'utf8');
    let pkg = JSON.parse(content);
    version = pkg['dist-tags'][ version ] || version;
    return version ? pkg.versions[version] : pkg;
  }
  async save(pkg){
    const { name } = pkg;
    const { dir } = this.options;
    const filename = path.join(dir, name, name + '.json');
    const writeFile = util.promisify(fs.writeFile);
    mkdirp.sync(path.dirname(filename));
    await writeFile(filename, JSON.stringify(pkg));
    return pkg;
  }
  async publish(pkg){
    const { dir } = this.options;
    const writeFile = util.promisify(fs.writeFile);
    const originPackage = await this.fetch(pkg.name);
    originPackage.name = pkg.name;
    originPackage.readme = pkg.readme;
    originPackage.description = pkg.description;
    Object.assign(originPackage.versions, pkg.versions);
    Object.assign(originPackage['dist-tags'], pkg['dist-tags']);
    Object.keys(pkg._attachments).forEach(filename => {
      const attachment = pkg._attachments[filename];
      writeFile(path.join(dir, pkg.name, filename), attachment.data, 'base64');
    });
    return this.save(originPackage);
  }
  async getFileStream(name, filename){
    const { dir } = this.options;
    return fs.createReadStream(path.join(dir, name, filename));
  }
}

module.exports = Storage;