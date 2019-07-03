const fs   = require('fs');
const path = require('path');

const cwd = process.cwd();
const tpl = path.resolve(__dirname, '../templates');

var pkg = {};
try{
  Object.assign(pkg, require(path.join(cwd, 'package.json')));
}catch(e){}

pkg = Object.assign({
  main       : 'index.js',
  version    : '0.0.0',
  license    : 'MIT',
  description: '',
  name       : path.basename(cwd),
  author     : process.env.USER,
  year       : (new Date).getFullYear() 
}, pkg);

function render(name, obj, to){
  var filename = path.join(tpl, name);
  var content = fs.readFileSync(filename, 'utf8');
  content = content.replace(/\${([\s\S]*?)}/g, function(match, key, index){
    return obj[ key ] || '';
  });
  fs.writeFileSync(to, content);
  return content;
}
/**
 * [readme description]
 * @return {[type]} [description]
 */
function readme(){
  pkg.varname = pkg.name.replace(/-(.)/g, (_, m) => m.toUpperCase());
  return render('readme.md', pkg, path.join(cwd, 'README.md'));
};

/**
 * [copy description]
 * @param  {[type]} from [description]
 * @param  {[type]} to   [description]
 * @return {[type]}      [description]
 */
function copy(from, to){
  to = to || from;
  from = path.join(tpl, from);
  fs.createReadStream(from).pipe(fs.createWriteStream(to));
}

/**
 * [gitignore description]
 * @return {[type]} [description]
 */
function gitignore(){
  copy('gitignore', '.gitignore');
}

/**
 * [npmignore description]
 * @return {[type]} [description]
 */
function npmignore(){
  copy('npmignore', '.npmignore');
}

function license(){
  render('licenses/' + pkg.license.toLowerCase(), pkg, path.join(cwd, 'LICENSE'));
}

module.exports = function(options){

  readme();
  license();
  gitignore();
  npmignore();

};