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

program.parse(process.argv);
