const Vue = (function () {

  /**
   * 根据我理解，数据与订阅者的关系是多对多：
   * 一个数据可以被多个订阅者订阅
   * 一个订阅者可以订阅多个数据
   * 而 Dependency 是："一个数据可以被多个订阅者订阅" 的关系描述
   * 不同的 Dnpendency 由它们独自的 ID 区分开
   */
  let uid = 0;
  class Dependency {
    constructor () {
      this.id = uid++; // 给依赖分配 ID
      this.subcribers = []; // 初始化数据的订阅者数组
    }
    // 添加订阅者
    addSubscriber (sub) {
      this.subcribers.push(sub);
    }
    // 通知订阅者更新（触发回调）
    notify () {
      this.subcribers.forEach(sub => {
        sub.update();
      });
    }
    // 触发 target 上的订阅者实例中的 addDependency 方法
    depend () {
      Dependency.target.addDependency(this);
    }
  }
  // Dependency 静态属性，工作时会设为 Subscriber 实例
  Dependency.target = null;

  /**
   * 观察者
   */
  class Observer {
    constructor (vm, data) {
      this.vm = vm;
      this.data = data;
      this.walk(this.data);
    }
    walk (data) {
      const dep = new Dependency();
      this.vm.$data = new Proxy(data, {
        get: (target, key, receiver) => {
          if (Dependency.target) {
            dep.depend();
          }
          return Reflect.get(target, key, receiver);
        },
        set: (target, key, val, receiver) => {
          Reflect.set(target, key, val, receiver);
          dep.notify();
          return true;
        },
      });
    }
  }

  function observe (vm, data) {
    if (typeof data !== 'object') {
      return;
    }
    return new Observer(vm, data);
  }

  /**
   * 数据订阅者，也就是 Watcher
   */
  class Subscriber {
    /**
     * @param {Vue} vm Vue 实例
     * @param {string} expOrFn 订阅的数据属性名称
     * @param {Function} cb 回调函数
     */
    constructor (vm, expOrFn, cb) {
      this.depIds = {};
      this.vm = vm;
      this.expOrFn = expOrFn;
      this.cb = cb;
      this.val = this.getValue();
    }
    /**
     * 增加依赖
     * @param {Dependency} dep
     * @return {void}
     */
    addDependency (dep) {
      if (!this.depIds.hasOwnProperty(dep.id)) {
        this.depIds[dep.id] = dep;
        dep.addSubscriber(this);
      }
    }
    update () {
      this.run();
    }
    run () {
      const newVal = this.getValue();
      if (this.val === newVal) {
        return;
      }
      this.val = newVal;
      this.cb.call(this.vm, this.val);
    }
    getValue () {
      Dependency.target = this;
      const val = this.vm.$data[this.expOrFn]; // 触发 proxyData get 方法
      Dependency.target = null;
      return val;
    }
  }

  class Vue {
    constructor (options = {}) {
      // 简化 options 的处理
      this.$options = options;
      // 简化 data 的处理
      this._data = options.data;
      // 监测数据
      observe(this, this._data);
    }
    // 暴露给外部的接口
    $watch (expOrFn, cb) {
      new Subscriber(this, expOrFn, cb);
    }
  }

  return Vue;
}());
