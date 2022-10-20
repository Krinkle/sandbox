const cp = require('child_process');
const path = require('path');
const os = require('os');

async function run(num) {
  const cmd = process.execPath;
  const args = [ path.join(__dirname, 'tmp.js') ];
  const spawned = cp.spawn(cmd, args, {
    cwd: __dirname,
    env: {},
    windowsVerbatimArguments: true
  });

  function debug(label, str = '') {
    console.log(`DEBUG: [${num}][${label}]`, String(str));
  }

  const result = {
    num: num,
    code: null,
    stdout: '',
    stderr: ''
  };
  spawned.stdout.on('data', data => {
      debug('on-stdout', data);
      result.stdout += data;
    });
    spawned.stderr.on('data', data => {
      debug('on-stderr', data);
      result.stderr += data;
    });
    const execPromise = new Promise((resolve, reject) => {
      spawned.on('error', error => {
        debug('on-error', error);
        reject(error);
      });
      spawned.on('exit', (exitCode, _signal) => {
        debug('on-exit', exitCode);
        result.code = exitCode;
      });
      spawned.on('close', () => {
        debug('on-close');
        if (result.code !== 0) {
          reject(new Error('Error code ' + result.code));
        } else {
          resolve();
        }
      });
    });

    try {
      await execPromise;
    } catch (e) {
      debug('catch');
      result.code = result.code || 'unknown';
    }

    debug('assign');
    result.snapshot = result.stdout;
    if (result.stderr) {
      result.snapshot += (result.snapshot ? '\n\n' : '') + '# stderr\n' + result.stderr;
    }
    if (result.code) {
      result.snapshot += (result.snapshot ? '\n\n' : '') + '# exit code: ' + result.code;
    }

    return result;
}

(async function main() {
  const conc = os.cpus().length;
  const resultPromises = [];
  for (let i = 0; i < conc; i++) {
    resultPromises[i] = run(i);
  }
  for (let i = 0; i < conc; i++) {
    await resultPromises[i];
    resultPromises.push(run(conc + i));
  }
  for (let i = 0; i < conc; i++) {
    await resultPromises[conc + i];
    resultPromises.push(run(conc + conc + i));
  }
  await resultPromises.at(-1);

  for (let resultProm of resultPromises) {
    const result = await resultProm;
    if (!result.snapshot.trim().endsWith('# fail 0')) {
      console.log(`INFO: [${result.num}][snapshot]`, result.snapshot);
      process.exitCode = 1;
      throw new Error('What!');
    }
  }
}());
