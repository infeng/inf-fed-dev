var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');
let stat = Promise.promisify(fs.stat);
let mkdir = Promise.promisify(fs.mkdir);
let writeFile = Promise.promisify(fs.writeFile);
var ejs = require('ejs');
let renderFile = Promise.promisify(ejs.renderFile);

async function createForm(formName, formFolder) {
  let folder = path.join(__dirname, `../../src/containers/${formFolder}`);
  try {
    await stat(folder);
  }catch (err) {
    await mkdir(folder);
  }
  try {
    let formPath = path.join(folder, `${formName}.tsx`);
    try {
      await stat(formPath);
      throw new Error(`form ${formPath} already created`);
    }catch(err) {
      let templateFile = 'form.template.ejs';
      let WrappedComponentName = path.basename(formFolder);
      let componentName = formName;
      if (componentName === 'index') {
        componentName = WrappedComponentName;
      }
      let modelName = WrappedComponentName.replace(/^\w/, WrappedComponentName[0].toLowerCase());
      let content = await renderFile(path.join(__dirname, templateFile), {
        modelName,
        componentName,
      });
      await writeFile(formPath, content);
      console.log(`create form ${formPath} successful`);
    }
  }catch (err) {
    console.log(err.message);
  }
}

async function form(formName, formFolder) {
  try {
    await createForm(formName, formFolder);
  }catch(err) {
    console.log(err.message);
  }
}

module.exports = form;