/**
 * 对象是否属于某个需要特殊处理的类型
 *
 * @param  {*} val
 * @param  {string} type 'Array' | 'RegExp' | 'Date'
 * @return {boolean}
 */
function isType (val, type) {
  if (typeof val !== 'object') return false;
  const typeString = Object.prototype.toString.call(val);
  return typeString === `[object ${type}]`;
}

/**
 * 提取正则对象的 flags 的函数
 *
 * @param  {RegExp} reg
 * @return {string}
 */
function getRegExp (reg) {
  let flags = '';
  if (reg.global) {
    flags += 'g';
  }
  if (reg.ignoreCase) {
    flags += 'i';
  }
  if (reg.multiline) {
    flags += 'm';
  }
  return flags;
}

/**
 * 深克隆
 *
 * @param  {any} parent
 * @return {any}
 */
function deepClone (parent) {
  // 维护两个储存循环引用的数组
  const parents = [];
  const children = [];
  const _clone = (parent) => {
    // 判断 parent 如果是原始类型或 null 与 undefined，则直接返回
    // 这里有个坑：typeof null 是 'object'
    if (parent === null || parent === undefined || typeof parent !== 'object') {
      return parent;
    }
    let child, proto;
    if (isType(parent, 'Array')) { // 对数组处理
      child = [];
    } else if (isType(parent, 'RegExp')) { // 对正则处理
      child = new RegExp(parent.source, getRegExp(parent));
      if (parent.lastIndex) {
        child.lastIndex = parent.lastIndex;
      }
    } else if (isType(parent, 'Date')) { // 对日期对象处理
      child = new Date(parent.getTime());
    } else if (isType(parent, 'Map')) { // 对 map 处理
      child = new Map();
      for (const key of parent.keys()) {
        child.set(_clone(key), _clone(parent.get(key)));
      }
      return child;
    } else { // 对 object 处理，function 也在这里
      // 处理对象原型
      proto = Object.getPrototypeOf(parent);
      // 利用 Object.create 切断原型链
      child = Object.create(proto);
    }

    // 处理循环引用
    const index = parents.indexOf(parent);
    if (index >= 0) { // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
      return children[index];
    }

    // 把当前复制与被复制的对象都存放到已见过的对象的数组中
    parents.push(parent);
    children.push(child);

    for (const key in parent) {
      child[key] = _clone(parent[key]);
    }

    return child;
  };

  return _clone(parent);
}
