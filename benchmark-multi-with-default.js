const { AsyncLocalStorage } = require("async_hooks");

class Class {
  str = "";
  num = 0;
  bool = false;
  method() {}
}

function run(fn) {
  console.time("time");
  for (let i = 1; i <= 100000; i++) {
    fn();
  }
  console.timeEnd("time");
}

{
  run(() => {
    for (let i = 1; i <= 100; i++) {
      new Class().method();
    }
  });
}

{
  const storage = new AsyncLocalStorage();
  const instances = new Array(100).fill(new Class());
  run(() => {
    storage.run({}, () => {
      instances.forEach((instance) => instance.method());
    });
  });
}
