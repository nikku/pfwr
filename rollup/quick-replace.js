import MagicString from 'magic-string';
import { createFilter } from '@rollup/pluginutils';

import pkg from '../package.json';

import replace from '@rollup/plugin-replace';

import alias from '@rollup/plugin-alias';


/**
 * A suite of rollup plug-in that modify node execuables
 * to be QuickJS compatible.
 *
 * Replaces the following patterns (NodeJS to QuickJS):
 *
 *   * `process.argv.slice(2)` -> `scriptArgs.slice(1)`
 *   * `console.error(` -> `console.log('ERR: '`
 *   * `require(...package.json)` -> `"{PACKAGE_VERSION}"`
 *   * `#!/some/shebang` -> ``
 *   * `process.exit` -> `std_exit`
 *
 * Imports `std.exit` where needed.
 *
 * Imports stub `path` and `fs` utilities. `fs` utility supports
 * synchronous read and write file APIs only.
 *
 * @param  {Object} options
 *
 * @return {Array<Object>} plug-ins
 */
export default function quickReplace(options = {}) {
  const filter = createFilter(options.include, options.exclude);

  return [
    {
      name: 'quickReplace',

      renderChunk(code, chunk) {
        const id = chunk.fileName;
        if (!filter(id)) return null;

        return executeReplacements(code, id);
      },

      transform(code, id) {
        if (!filter(id)) return null;

        return executeReplacements(code, id);
      }
    },
    replace({
      delimiters: ['', ''],
      'process.argv.slice(2)': 'scriptArgs.slice(1)',
      'process.exit': 'std_exit',
      'console.error(': 'console.log("ERR: " + '
    }),
    alias({
      entries: [
        { find: 'fs', replacement: './external/fs.js' },
        { find: 'path', replacement: './external/path.js' }
      ]
    })
  ];

  function executeReplacements(code, id) {
    const magicString = new MagicString(code);

    const dirty = [
      addStd(code, magicString),
      replaceVersion(code, magicString),
      replaceShebang(code, magicString)
    ].reduce((dirty, replaced) => dirty || replaced);

    if (!dirty) {
      return null;
    }

    const result = { code: magicString.toString() };
    if (isSourceMapEnabled()) {
      result.map = magicString.generateMap({ hires: true });
    }
    return result;
  }

  function addStd(code, magicString) {

    if (code.match(/std_exit\(/)) {
      magicString.prepend(`import { exit as std_exit } from 'std';\n`);

      return true;
    }
  }

  function replaceShebang(code, magicString) {
    const match = code.match(/^#![^\n]*/);

    if (match) {
      const start = match.index;
      const end = start + match[0].length;

      magicString.remove(start, end);

      return true;
    }
  }

  function replaceVersion(code, magicString) {

    const match = /require\(['"]{1}(.*)package(\.json)?['"]{1}\)\.version/.exec(code);

    if (match) {
      const start = match.index;
      const end = start + match[0].length;
      const replacement = JSON.stringify(pkg.version);

      magicString.overwrite(start, end, replacement);

      return true;
    }
  }

  function isSourceMapEnabled() {
    return options.sourceMap !== false && options.sourcemap !== false;
  }
}