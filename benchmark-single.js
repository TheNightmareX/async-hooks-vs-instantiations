const { AsyncLocalStorage } = require('async_hooks');

class Class {
  method() {}
}

function run(fn) {
  console.time('time');
  for (let i = 1; i <= 10000000; i++) {
    fn();
  }
  console.timeEnd('time');
}

{
  run(() => {
    new Class().method();
  });
}

{
  const storage = new AsyncLocalStorage();
  const instance = new Class();
  run(() => {
    storage.run({}, () => instance.method());
  });
}
