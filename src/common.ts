var fs = require('fs');
var Promise2 = require('bluebird');
let access = Promise2.promisify(fs.access);

export async function existFile(dir) {
  try {
    await access(dir);
    return false;
  }catch(err){
    return true;
  }
}

export function install(done) {
  console.log('run npm install');
  runCmd('npm', ['install'], function () {
    console.log('npm install end');
    done();
  });  
}

function runCmd(cmd, args, fn) {
  args = args || [];
  var runner = require('child_process').spawn(cmd, args, {
    // keep color
    stdio: "inherit"
  });
  runner.on('close', function (code) {
    if (fn) {
      fn(code);
    }
  });
}