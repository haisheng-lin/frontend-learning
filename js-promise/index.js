/**
 * 模拟 Promise 类
 *
 * @param {Function} processFunc
 * @constructor
 */
function PromiseM (processFunc) {
  this._status = 'pending'; // 初始化状态
  this._data = null; // 初始化 Promise 携带的数据
  this._defered = []; // 接下来要执行的 Promise 数组
  processFunc.call(
    this,
    this.resolve.bind(this), // 这是一个以传入的参数作为函数执行时的 this 的函数
    this.reject.bind(this),
  );
  // JavaScript 会帮我们返回 this，如果我们不显式声明 return 的话
}

PromiseM.prototype.resolve = function (data) {
  this._status = 'resolved';
  this._data = data;
  this._done(); // 一旦进入 resolved 状态，那么当前 Promise 的生命周期结束，状态不再更改
};

PromiseM.prototype.reject = function (data) {
  this._status = 'rejected';
  this._data = data;
  this._done(); // 一旦进入 rejected 状态，那么当前 Promise 的生命周期结束，状态不再更改
};

PromiseM.prototype.then = function (callback) {
  const promiseData = {
    onResolved: callback,
    promise: new PromiseM(function () {}),
  };
  if (this._status === 'pending') {
    this._defered.push(promiseData);
  }
  return this;
};

PromiseM.prototype.catch = function (callback) {
  const promiseData = {
    onRejected: callback,
    promise: new PromiseM(function () {}),
  };
  if (this._status === 'pending') {
    this._defered.push(promiseData);
  }
  return this;
};

PromiseM.prototype._done = function () { // 结束 Promise 生命周期需要执行的函数
  const promiseData = this._defered.shift(); // 拿出下一个需要执行的 promise 数据
  switch (this._status) {
    case 'resolved':
      if (promiseData.onResolved) {
        const p = promiseData.onResolved(this._data);
        if (p && p.constructor === PromiseM) { // 如果 p 是一个 Promise 的话，需要让他继续执行
          p._defered = this._defered; // 把当前剩下的 promise 移交给 p
        }
      } else {
        this._done();
      }
      break;
    case 'rejected':
      if (promiseData.onRejected) {
        const p = promiseData.onRejected(this._data);
        if (p && p.constructor === PromiseM) { // 如果 p 是一个 Promise 的话，需要让他继续执行
          p._defered = this._defered; // 把当前剩下的 promise 移交给 p
        }
      } else {
        this._done();
      }
      break;
  }
};

// 难点：then 方法需要返回一个新的子 Promise，并且前后的 Promise 需要建立联系，才能决定他们的执行顺序

new PromiseM((resolve, reject) => {
  setTimeout(() => { reject('hehe'); }, 1000);
}).then(data => {
  return new PromiseM((resolve, reject) => {
    setTimeout(() => { resolve(`map: ${data}`); }, 2000);
  });
}).then(data => {
  console.log(`receive: ${data}`);
}).catch(data => {
  console.log(`error: ${data}`);
});
