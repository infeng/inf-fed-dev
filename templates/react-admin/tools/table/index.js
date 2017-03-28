var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');
let stat = Promise.promisify(fs.stat);
let mkdir = Promise.promisify(fs.mkdir);
let writeFile = Promise.promisify(fs.writeFile);
var ejs = require('ejs');
let renderFile = Promise.promisify(ejs.renderFile);

async function createTable(tableName, tableFolder) {
  let folder = path.join(__dirname, `../../src/containers/${tableFolder}`);
  try {
    await stat(folder);
  }catch (err) {
    await mkdir(folder);
  }
  try {
    let tablePath = path.join(folder, `${tableName}.tsx`);
    try {
      await stat(tablePath);
      throw new Error(`table ${tablePath} already created`);
    }catch(err) {
      let templateFile = 'table.template.ejs';
      let WrappedComponentName = path.basename(tableFolder);
      let componentName = tableName;
      if (componentName === 'index') {
        componentName = WrappedComponentName;
      }
      let modelName = WrappedComponentName.replace(/^\w/, WrappedComponentName[0].toLowerCase());
      let content = await renderFile(path.join(__dirname, templateFile), {
        modelName,
        componentName,
      });
      await writeFile(tablePath, content);
      console.log(`create table ${tablePath} successful`);
    }
  }catch (err) {
    console.log(err.message);
  }
}

async function table(tableName, folder) {
  try {
    await createTable(tableName, folder);
  }catch(err) {
    console.log(err.message);
  }
}

module.exports = table;