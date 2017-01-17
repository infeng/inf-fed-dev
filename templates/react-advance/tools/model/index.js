var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');
let stat = Promise.promisify(fs.stat);
let mkdir = Promise.promisify(fs.mkdir);
let writeFile = Promise.promisify(fs.writeFile);
var ejs = require('ejs');
let renderFile = Promise.promisify(ejs.renderFile);

async function createModel(modelPath, api) {
  let modelFolder = path.join(__dirname, `../../src/models/${path.dirname(modelPath)}`);
  let modelName = path.basename(modelPath);
  try {
    await stat(modelFolder);
  }catch (err) {
    return console.log(`folder ${modelFolder} is not exist, please create it first`);
  }
  try {
    let modelPath = path.join(modelFolder, `${modelName}.ts`);
    try {
      await stat(modelPath);
      throw new Error(`model ${modelPath} already created`);
    }catch(err) {
      let templateFile = 'model.template.ejs';
      if (api) {
        templateFile = 'model.template.api.ejs';
      }
      let componentName = modelName.replace(/^\w/, modelName[0].toUpperCase());
      let content = await renderFile(path.join(__dirname, templateFile), {
        modelName,
        componentName,
      });
      await writeFile(modelPath, content);
      console.log(`create model ${modelPath} successful`);
    }
  }catch (err) {
    console.log(err.message);
  }
}

async function model(modelPath, api) {
  try {
    await createModel(modelPath, api);
  }catch(err) {
    console.log(err.message);
  }
}

module.exports = model;