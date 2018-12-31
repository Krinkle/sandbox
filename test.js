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
          - bb/
             - file1
`);
const treeDir = path.join(__dirname, '__TREE__');
fs.mkdirSync(treeDir);
fs.mkdirSync(path.join(treeDir, 'home'));
fs.mkdirSync(path.join(treeDir, 'home/a'));
fs.writeFileSync(path.join(treeDir, 'home/a/file1'), '');
fs.mkdirSync(path.join(treeDir, 'home/b'));
fs.writeFileSync(path.join(treeDir, 'home/b/file1'), '');
fs.writeFileSync(path.join(treeDir, 'home/b/file2'), '');
fs.mkdirSync(path.join(treeDir, 'home/bb'));
fs.writeFileSync(path.join(treeDir, 'home/bb/file1'), '');

console.log('... starting fs.watch() on each directory and sub directory');
const watchers = {
  'home': fs.watch(path.join(treeDir, 'home'), {
    encoding: 'utf8',
    recursive: false
  }),
  'home/b': fs.watch(path.join(treeDir, 'home/b'), {
    encoding: 'utf8',
    recursive: false
  }),
  'home/bb': fs.watch(path.join(treeDir, 'home/bb'), {
    encoding: 'utf8',
    recursive: false
  })
};
console.log('');

const dirbb = path.join(treeDir, 'home/bb');
const filebb1 = path.join(treeDir, 'home/bb/file1');

setTimeout(function () {
  console.log(`... idled 500 ms`);
  console.log('');

  console.log(`... attaching on('change', fn) to each fs.FSWatcher object`);
  let ok = true;
  for (const base in watchers) {
    watchers[base].on('change', (evt, name) => {
      let affected = path.join(treeDir, base, name);

      // For Linux
      // - change for home/bb/file1
      // -> OK
      //
      // For Windows
      // - change for home/bb
      // - change for home/bb/file1
      // -> OK, I guess.
      //
      // For macOS
      // - change for home/b/file1
      // - change for home/bb/file1
      // -> WHAT !?

      if (affected !== filebb1 && affected !== dirbb) {
        ok = false;
        console.log(base, '[change: UNEXPECTED]', evt, name);
      } else {
        console.log(base, '[change: expected]', evt, name);
      }
    });
  }
  console.log('');

  console.log(`... modifying home/bb/file1`);
  fs.appendFileSync(filebb1, 'hello');
  console.log('');

  setTimeout(function () {
    console.log(`... idled 2000 ms`);
    console.log('');

    for (const base in watchers) watchers[base].close();
    if (!ok) {
      process.exit(1);
    }
  }, 2000);

}, 500);
