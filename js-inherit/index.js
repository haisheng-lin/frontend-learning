function Parent () {
  this.parent = 'parent';
}

Parent.prototype.parentFunc = function () {
  console.log('parentFunc');
};

function Child () {
  Parent.apply(this, arguments); // 构造函数继承
  this.child = 'child';
}

Child.prototype = Object.create(Parent.prototype); // 相当于 Child.prototype.__proto__ = Parent.prototype
// 由于上一行代码，Child.prototype 的原型对象是 Parent.prototype，所以会有 Child.prototype.constructor = Parent，需要我们手动修改 constructor
Child.prototype.constructor = Child;

Child.prototype.childFunc = function () {
  console.log('childFunc');
};

const c = new Child();
c.parentFunc();
c.childFunc();
console.log(c.child);
console.log(c.parent);
console.log(Child.prototype.constructor === Child);
console.log(Child.prototype.constructor === Parent);
