
class Proxy {
  constructor({ registry, storage }){
    this.storage = storage;
    this.registry = registry;
  }
  async fetch(name, version){
    const { registry, storage } = this;
    let pkg = await storage.fetch(name, version);
    if(pkg) return pkg;
    console.warn(`[upkg] cache missing ${name}`);
    pkg = await registry.fetch(name);
    if(!pkg) return;
    await storage.save(pkg);
    version = pkg['dist-tags'][version] || version;
    return version ? (pkg.versions[version]) : pkg;
  }
  async publish(pkg){
    const { storage } = this;
    await storage.publish(pkg);
  }
  async getFileStream(name, filename){
    const { storage } = this;
    return storage.getFileStream(name, filename);
  }
}

module.exports = Proxy;