import * as path from 'path';
import * as fs from 'fs';
var Promise2 = require('bluebird');
var ejs = require('ejs');
let renderFile = Promise2.promisify(ejs.renderFile);
const ncp = Promise2.promisify(require('ncp'));
var mkdir = Promise2.promisify(fs.mkdir);
let writeFile = Promise2.promisify(fs.writeFile);
import * as vfs from 'vinyl-fs';
import * as common from './common';

async function run(appName, install) {
  const appFolder = path.join(process.cwd(), appName);
  console.log(`start create a admin react boilerplate in ${appFolder}`);
  if (!await common.existFile(appFolder)) {
    return console.error('Existing files here, please run this command in an empty folder!');
  }
  await mkdir(appFolder);
  process.chdir(appFolder);
  const dest = process.cwd();
  const templateFolder = path.join(__dirname, '../templates/react-admin');
  console.log(templateFolder);
  // // copy files exclude package.json
  vfs.src(['**/*', '!package.json'], {cwd: templateFolder, cwdbase: true, dot: true})
  .pipe(vfs.dest(dest))
  .on('end', () => {
    fs.renameSync(path.join(dest, 'gitignore'), path.join(dest, '.gitignore'));
  });
  // copy package.json
  let content = await renderFile(path.join(templateFolder, 'package.json'), {
    appName: appName,
  });
  let packageJsonPath = path.join(dest, 'package.json');
  await writeFile(packageJsonPath, content);
  if (install) {
    common.install(() => {
      success();
    });
  }else {
    success();
  }
}

function success() {
  console.log('create admin react app success');
}

export default run;
