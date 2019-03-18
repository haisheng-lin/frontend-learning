/**
  * 节流函数
  *
  * @param {Function} action
  * @param {number} delay
  * @returns {Function}
  */
 function throttle (action, delay) {
  let timeout;
  let lastRun = 0;
  return function () {
    if (timeout) {
      return;
    }
    let timeGap = Date.now() - lastRun;
    const context = this;
    const args = arguments;
    const runCallback = function () {
      timeout = null;
      lastRun = Date.now();
      action.apply(context, args);
    };
    if (timeGap >= delay) { // 超过节流时间，可以再执行一次 action
      runCallback();
    } else {
      timeout = setTimeout(runCallback, delay);
    }
  };
}