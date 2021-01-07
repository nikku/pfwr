import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

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
  }
];

export default configs;


// helpers //////////////////////

function pgl(plugins=[]) {
  return [
    nodeResolve({
      mainFields: [
        'main'
      ]
    }),
    commonjs(),
    json(),
    ...plugins
  ];
}