#!/usr/bin/env node
'use strict';

var program = require('commander');
let createReact = require('../lib/createReact').default;
let createFullReact = require('../lib/createReact.full').default;
let createAdminReact = require('../lib/createReact.admin').default;

program
.description('create react-typescript-boilerplate')
.command('react <name>')
.option('--no-install', 'Disable npm install after files created')
.action(function(name, options){
  var install = options.install;
  console.log(`create react-app ${name}`);
  createReact(name, install);
});

program
.description('create react-typescript-redux-saga-boilerplate')
.command('react-full <name>')
.option('--no-install', 'Disable npm install after files created')
.action(function(name, options){
  var install = options.install;
  console.log(`create react-full-app ${name}`);
  createFullReact(name, install);
});

program
.description('create admin app whth react-typescript-redux-saga-antd')
.command('react-admin <name>')
.option('--no-install', 'Disable npm install after files created')
.action(function(name, options){
  var install = options.install;
  console.log(`create react-admin-app ${name}`);
  createAdminReact(name, install);
});

program.parse(process.argv);
