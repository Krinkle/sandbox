const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log(`
... creating fixture:
    - home/
          - a/
             - file1
          - b/
             - file1
             - file2
          - c/
          - d/
`);
const treeDir = path.join(__dirname, '__TREE__');
fs.mkdirSync(treeDir);
fs.mkdirSync(path.join(treeDir, 'home'));
fs.mkdirSync(path.join(treeDir, 'home/a'));
fs.writeFileSync(path.join(treeDir, 'home/a/file1'), '');
fs.mkdirSync(path.join(treeDir, 'home/b'));
fs.writeFileSync(path.join(treeDir, 'home/b/file1'), '');
fs.writeFileSync(path.join(treeDir, 'home/b/file2'), '');
fs.mkdirSync(path.join(treeDir, 'home/c'));
fs.mkdirSync(path.join(treeDir, 'home/d'));

console.log('... starting fs.watch() on each directory and sub directory');
const watchers = {
  'home': fs.watch(path.join(treeDir, 'home'), {
    encoding: 'utf8',
    recursive: false
  }),
  'home/a': fs.watch(path.join(treeDir, 'home/a'), {
    encoding: 'utf8',
    recursive: false
  }),
  'home/b': fs.watch(path.join(treeDir, 'home/b'), {
    encoding: 'utf8',
    recursive: false
  }),
  'home/c': fs.watch(path.join(treeDir, 'home/c'), {
    encoding: 'utf8',
    recursive: false
  }),
  'home/d': fs.watch(path.join(treeDir, 'home/d'), {
    encoding: 'utf8',
    recursive: false
  })
};

const dirHome = path.join(treeDir, 'home');
const dirC = path.join(treeDir, 'home/c');

setTimeout(function () {
  console.log(`... idled 500 ms`);

  console.log(`... attaching on('change', fn) to each fs.FSWatcher object`);
  let ok = true;
  for (const base in watchers) {
    watchers[base].on('error', (err) => {
        console.log(base, '[error]', String(err));
    });
    watchers[base].on('change', (evt, name) => {
      let affected = path.join(treeDir, base, name);

      // For Linux
      // For Windows
      //
      // For macOS

      if (affected !== dirHome && affected !== dirC) {
        ok = false;
        console.log(base, '[change: UNEXPECTED]', evt, name);
      } else {
        console.log(base, '[change: expected]', evt, name);
      }
    });
  }

  console.log(`... removing home/c/`);
  fs.rmdirSync(dirC);
  console.log('');

  setTimeout(function () {
    console.log('');
    console.log(`... idled 2000 ms`);

    for (const base in watchers) watchers[base].close();
    if (!ok) {
      process.exit(1);
    }
  }, 2000);

}, 500);
