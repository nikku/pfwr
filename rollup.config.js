import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { string } from 'rollup-plugin-string';

import pkg from './package.json';

const outputDir = 'dist';

const configs = [
  {
    input: './src/index.js',
    output: {
      file: `${outputDir}/index.js`,
      format: 'esm',
      exports: 'named'
    },
    external: Object.keys(pkg.dependencies),
    plugins: pgl()
  }
];

export default configs;


// helpers //////////////////////

function pgl(plugins=[]) {
  return [
    ...plugins,
    string({
      include: 'browser/**/*.*'
    }),
    commonjs(),
    json()
  ];
}