let id = 0; // 每一个 jsonp 都有独有的 id，防止命名冲突

/**
 * 模拟实现 jsonp
 *
 * @param {string} baseUrl url 路径
 * @param {object} params 附带的参数，会拼接在 url 后
 * @param {object} options 其余选项，包括 callbackKey, callbackName, timeout
 * - callbackKey: 服务器获取回调函数名称的键值
 * - callbackName: 回调函数的名称
 * - timeout: 单位为 ms，如果在指定时间内没有获得响应数据，将会报错
 * @returns {Promise<any>}
 * 
 * 例如：jsonp('//localhost:3000/api/test', null, { callbackKey: 'callback', callbackName: 'lhs' })
 * 最后实际访问服务器的 url 是：//localhost:3000/api/test?callback=lhs
 * 服务器可从 callback 的字段查找到回调函数的名称为 lhs
 */
function jsonp (baseUrl, params, { callbackKey, callbackName, timeout }) {

  return new Promise((resolve, reject) => {
    const paramStr = parseParams(Object.assign({}, params, { [callbackKey]: callbackName }));
    const url = baseUrl.indexOf('?') > 0 ? `${baseUrl}&${paramStr}` : `${baseUrl}?${paramStr}`; // 把参数拼接在 url 后

    const callback = callbackName || `__jsonp${id++}__`;

    const script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);

    let hasResolved = false;

    const timer = setTimeout(() => {
      if (!hasResolved) {
        reject(new Error('timeout'));
        clear();
      }
    }, timeout || 20 * 1000);

    window[callback] = function (data) {
      hasResolved = true;
      resolve(data);
      clear();
    }

    /**
     * 清理回收资源
     *
     * @returns {void}
     */
    function clear () {
      document.head.removeChild(script);
      clearTimeout(timer);
      delete window[callback];
    }

    /**
     * 把 object 类型的参数转化成 url 形式的参数字符串
     *
     * @param {object} params
     * @returns {string}
     */
    function parseParams (params) {
      let ret = '';
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          if (ret.length > 0) {
            ret += '&';
          }
          ret += `${key}=${params[key] || ''}`;
        }
      }
      return ret;
    }
  });
}
