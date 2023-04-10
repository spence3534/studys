## 原型

当创建一个函数时，都会具备一个`prototype`属性（原型对象），而原型对象有一个`constructor`属性，这个属性指回跟它关联的构造函数。看下面的例子。

```js
function Person() {}

Person.prototype.name = "图图";
Person.prototype.age = 23;
Person.prototype.getName = function () {
  console.log(this.name);
};

console.log(Person.prototype.constructor === Person); // true
```

这个例子中，`Person.prototype.constructor`指向了`Person`。

当自定义构造函数时，原型对象只会获取`constructor`属性。其他的所有方法和属性都继承于`Object`对象。

```js
function Person() {}

console.log(Person.prototype);
/* 
  constructor: ƒ Person()
  __proto__:
  constructor: ƒ Object()
  hasOwnProperty: ƒ hasOwnProperty()
  isPrototypeOf: ƒ isPrototypeOf()
  propertyIsEnumerable: ƒ propertyIsEnumerable()
  toLocaleString: ƒ toLocaleString()
  toString: ƒ toString()
  valueOf: ƒ valueOf()
  __defineGetter__: ƒ __defineGetter__()
  __defineSetter__: ƒ __defineSetter__()
  __lookupGetter__: ƒ __lookupGetter__()
  __lookupSetter__: ƒ __lookupSetter__()
  get __proto__: ƒ __proto__()
  set __proto__: ƒ __proto__()
*/

console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Person.prototype.__proto__.constructor === Object); // true
console.log(Person.prototype.__proto__.__proto__ === null); // true
```

每次调用（`通过new`）构造函数创建一个实例时，这个实例内部有一个`__proto__`（隐式`proto`）指针，这个指针指向构造函数的原型对象。

```js
function Person() {}

Person.prototype.name = "图图";
Person.prototype.age = 23;
Person.prototype.getName = function () {
  console.log(this.name);
};

let person1 = new Person();
console.log(person1.__proto__);
/*
  age: 23
  getName: ƒ ()
  name: "图图"
  constructor: ƒ Person() 
*/

console.log(person1.__proto__.constructor === Person); // true
```

`person1.__proto__`指针指向了`Person.prototype`，通过`person1.__proto__.constructor`可以访问`Person`构造函数。

实例和构造函数原型之间有直接关联，而实例和构造函数之间不存在关联。

```js
function Person() {}

Person.prototype.name = "图图";
Person.prototype.age = 23;
Person.prototype.getName = function () {
  console.log(this.name);
};

let person1 = new Person();
let person2 = new Person();
console.log(person1 === Person); // false

console.log(person1.__proto__ === Person.prototype); // true
console.log(person2.__proto__ === Person.prototype); // true
console.log(person1.__proto__ === person2.__proto__); // true
```

同一个构造函数创建两个实例时，这两个实例的`__proto__`指针都是指向同一个原型对象。那么，我们就可以将一些公共属性和方法定义在原型属性上。

## `new`操作符

使用`new`操作符时，内部会做以下五件事。

1. 在内存中创建一个新对象。
2. 这个新对象内部的`[[Prototype]]`特性被赋值为构造函数的`prototype`属性。
3. 构造函数内部的`this`被赋值为这个新对象，也就是`this`指向新对象。
4. 执行构造函数内部的代码（给新对象添加属性）。
5. 返回新对象


每创建一个函数，都会有一个prototype原型对象属性，这个原型对象属性有一个constructor属性，这个constructor属性指向这个构造函数，两者是引用关系，每次调用构造函数创建实例时，实例内部的__proto__属性会被赋值为构造函数的原型对象，通过这个属性可以访问对象的原型