var program = require('commander');

let model = require('./model');
program
.command('model <modelPath>')
.description('create model')
.usage('test')
.option('--no-api', 'create model without api')
.action(function(modelPath, options){
  var api = options.api;
  console.log(`create model ${modelPath}`);
  model(modelPath, api);
});

let form = require('./form');
program
.command('form <formName>')
.description('create Form component')
.usage('test')
.option('--folder <value>', 'folder')
.action(function(formName, options){
  var folder = options.folder;
  console.log(`create form ${folder}/${formName}`);  
  form(formName, folder);
});

let table = require('./table');
program
.command('table <tableName>')
.description('create Table component')
.usage('test')
.option('--folder <value>', 'folder')
.action(function(tableName, options){
  var folder = options.folder;
  console.log(`create table ${folder}/${tableName}`);  
  table(tableName, folder);
});

program.parse(process.argv);
