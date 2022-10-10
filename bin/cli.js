#!/usr/bin/env node

import { pfwr } from '../dist/index.js';

import path from 'path';
import fs from 'fs';

import mri from 'mri';
import opener from 'opener';

import pkg from '../package.json' assert { type: "json" };

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

/**
 * Debounce fn, calling it only once if
 * the given time elapsed between calls.
 *
 * @param  {Function} fn
 * @param  {Number} timeout
 *
 * @return {Function} debounced function
 */
function debounce(fn, timeout) {

  var timer;

  var lastArgs;
  var lastThis;

  var lastNow;

  function fire() {

    var now = Date.now();

    var scheduledDiff = (lastNow + timeout) - now;

    if (scheduledDiff > 0) {
      return schedule(scheduledDiff);
    }

    fn.apply(lastThis, lastArgs);

    timer = lastNow = lastArgs = lastThis = undefined;
  }

  function schedule(timeout) {
    timer = setTimeout(fire, timeout);
  }

  return function(...args) {

    lastNow = Date.now();

    lastArgs = args;
    lastThis = this;

    // ensure an execution is scheduled
    if (!timer) {
      schedule(timeout);
    }
  };
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