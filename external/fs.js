import { loadFile, open } from 'std';

function readFileSync(fname) {
  return loadFile(fname);
}

function writeFileSync(fname, contents) {
  const file = open(fname, 'w');

  file.puts(contents);
  file.close();
}

export {
  readFileSync,
  writeFileSync
};