const { AsyncLocalStorage } = require("async_hooks");

function benchmark(name, handle) {
  console.time(name);
  for (let i = 1; i <= 100000; i++) {
    handle();
  }
  console.timeEnd(name);
}

function instantiation_no_prop() {
  class Service {
    doSomething() {}
  }
  return () => {
    for (let i = 1; i <= 100; i++) {
      new Service().doSomething();
    }
  };
}

function instantiation_with_prop() {
  class Service {
    prop;
    doSomething() {}
  }
  return () => {
    for (let i = 1; i <= 100; i++) {
      new Service().doSomething();
    }
  };
}

function async_hooks() {
  const storage = new AsyncLocalStorage();
  class Service {
    doSomething() {}
  }
  const instances = new Array(100).fill(new Service());
  return () => {
    storage.run({}, () => {
      for (const service of instances) {
        service.doSomething();
      }
    });
  };
}

[instantiation_no_prop, instantiation_with_prop, async_hooks].forEach((item) =>
  benchmark(item.name, item())
);
