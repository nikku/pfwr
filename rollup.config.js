import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import quickReplace from './rollup/quick-replace';
import { string } from 'rollup-plugin-string';

const outputDir = 'dist';

const configs = [
  {
    input: './src/index.js',
    output: {
      file: `${outputDir}/index.js`,
      format: 'cjs',
      exports: 'named'
    },
    plugins: pgl()
  },
  {
    input: './bin/cli.js',
    output: {
      file: `tmp/cli.js`,
      format: 'esm'
    },
    plugins: pgl([
      ...quickReplace()
    ]),
    external: [ 'std' ]
  }
];

export default configs;


// helpers //////////////////////

function pgl(plugins=[]) {
  return [
    ...plugins,
    nodeResolve({
      mainFields: [
        'browser',
        'module',
        'main'
      ]
    }),
    string({
      include: 'browser/**/*.*'
    }),
    commonjs(),
    json()
  ];
}