#!/usr/bin/env node

const { pfwr } = require('..');

const fs = require('fs');

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

  const t = Date.now();

  const input = {
    path: args[0],
    contents: fs.readFileSync(args[0], 'utf8')
  };

  return pfwr(input).then(output => {

    fs.writeFileSync(args[1], output.contents, 'utf8');

    console.log('Transformed %s -> %s in %sms', args[0], args[1], (Date.now() - t));
  });
})().catch(err => {
  console.error(err);

  process.exit(1);
})

