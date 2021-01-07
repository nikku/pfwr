#!/usr/bin/env node

const vfile = require('to-vfile');

const { pfwr } = require('..');

const args = process.argv.slice(2);

if (!args.length) {
  console.error('input and output required');

  process.exit(1);
}

if (args[0] === '--version') {
  console.log(require('../package').version);

  process.exit(0);
}

if (args[0] === '--help' || args.length !== 2) {
  console.log('Usage: pfwr <input.md> <output.html>');

  process.exit(0);
}

(function run() {
  var inputFile = vfile.readSync(args[0]);

  return pfwr(inputFile).then(outputFile => {
    vfile.writeSync({
      contents: outputFile.contents,
      path: args[1]
    });
  });
})().catch(err => {
  console.error(err);

  process.exit(1);
})

