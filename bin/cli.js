#!/usr/bin/env node

import { pfwr } from 'pfwr';

import path from 'node:path';
import fs from 'node:fs';
import process from 'node:process';

import { fileURLToPath } from 'node:url';

import mri from 'mri';
import opener from 'opener';

import { debounce } from 'min-dash';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

const argv = process.argv.slice(2);

const args = mri(argv, {
  boolean: [ 'open', 'help', 'watch' ],
  alias: {
    w: 'watch',
    h: 'help',
    o: 'open'
  }
});

if (args.version) {
  console.log(pkg.version);

  process.exit(0);
}

if (args.help) {
  console.log(
    `
Usage: pfwr input.md [output.html]

Options:
    -w, --watch     rebundle on change
    -o, --open      open the presentation in your web browser

Examples:
    $ pfwr presentation.md
    $ pfwr -w presentation.md slides.html
`);

  process.exit(0);
}

if (!args._.length) {
  console.error('input required');

  process.exit(1);
}

const inputFile = args._[0];

const outputFile = args._[1] || defaultOutput(inputFile);

async function run() {
  const t = Date.now();

  if (!fs.existsSync(inputFile)) {
    console.log('Created %s', inputFile);

    fs.copyFileSync(__dirname + '/template.md', inputFile);
  }

  const input = {
    path: inputFile,
    value: fs.readFileSync(inputFile, 'utf8')
  };

  return pfwr(input).then(output => {

    fs.writeFileSync(outputFile, output.value, 'utf8');

    console.log('Transformed %s -> %s in %sms', inputFile, outputFile, (Date.now() - t));
  });
}

function defaultOutput(inputFile) {
  return path.join(path.dirname(inputFile), path.basename(inputFile, '.md') + '.html');
}

// do actual work

function noop() { }

function watch() {
  console.log('Watching for changes...');

  fs.watch(inputFile, debounce(function(event) {

    // file gone, we stop watching here
    if (event === 'rename') {
      process.exit(0);
    }

    run().catch(err => {
      console.error(err);
    });
  }, 100));
}

function open() {
  opener(outputFile).unref();
}

run()
  .then(args.open ? open : noop)
  .then(args.watch ? watch : noop)
  .catch(err => {
    console.error(err);

    process.exit(1);
  });