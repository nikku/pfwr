import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { string } from 'rollup-plugin-string';

const outputDir = 'dist';

const configs = [
  {
    input: './src/index.js',
    output: {
      file: `${outputDir}/index.js`,
      format: 'esm',
      exports: 'named'
    },
    plugins: pgl()
  }
];

export default configs;


// helpers //////////////////////

function pgl(plugins=[]) {
  return [
    ...plugins,
    nodeResolve({
      mainFields: [
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