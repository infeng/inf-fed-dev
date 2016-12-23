#!/usr/bin/env node
'use strict';

var program = require('commander');
let createReact = require('../lib/createReact').default;

program
.description('create react-typescript-boilerplate')
.command('react <name>')
.action(function(name, options){
  console.log(`create react-app ${name}`);
  createReact(name);
});

program.parse(process.argv);
