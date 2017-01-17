#!/usr/bin/env node
'use strict';

var program = require('commander');
let createReact = require('../lib/createReact').default;
let createAdvanceReact = require('../lib/createReact.advance').default;

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
.command('react-advance <name>')
.option('--no-install', 'Disable npm install after files created')
.action(function(name, options){
  var install = options.install;
  console.log(`create react-advance-app ${name}`);
  createAdvanceReact(name, install);
});

program.parse(process.argv);
