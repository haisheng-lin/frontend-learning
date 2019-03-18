/**
 * 模拟 apply 实现
 *
 * @param {any} context 指定的 this，默认为 window
 * @param {any[]} params 参数数组
 * @returns {any} 函数指向的结果
 */
Function.prototype.myApply = function (context = window, params) {
  context.fn = this;
  const ret = context.fn(...params);
  delete context.fn;
  return ret;
};

/**
 * 模拟 call 实现
 *
 * @param {any} context 指定的 this，默认为 window
 * @param {any[]} params 参数数组
 * @returns {any} 函数指向的结果
 */
Function.prototype.myCall = function (context = window, ...params) {
  context.fn = this;
  const ret = context.fn(...params);
  delete context.fn;
  return ret;
};

/**
 * 模拟 bind 实现
 *
 * @param {any} context 指定的 this，默认为 window
 * @returns {Function} this 指向 context 的新函数
 */
Function.prototype.myBind = function (context = window) {
  const fn = this;
  if (typeof fn !== 'function') {
    throw new Error('调用 bind 的必须是函数类型');
  }
  return function (...params) {
    return fn.myCall(context, ...params);
  };
};

function myFunc (a, b, c) {
  console.log(a, b, c);
  console.log(this.a);
}

let obj = { a: '1' };

myFunc.myApply(obj, [1, 2, 3]);
myFunc.myCall(obj, 1, 2, 3);
const bound = myFunc.myBind(obj);
bound(1, 2, 3);
