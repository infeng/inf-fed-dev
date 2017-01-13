#!/usr/bin/env node
'use strict';

var program = require('commander');
let createReact = require('../lib/createReact').default;

program
.description('create react-typescript-boilerplate')
.command('react <name>')
.option('--no-install', 'Disable npm install after files created')
.action(function(name, options){
  var install = options.install;
  console.log(`create react-app ${name}`);
  createReact(name, install);
});

program.parse(process.argv);
