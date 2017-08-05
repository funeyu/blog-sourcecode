---
title: Node.js 包引入和ES6 包机制
date: 2017-08-03 12:51:22
tags: ['javascript', 'nodejs']
---
![](/img/posts/nodejs.png)

在用Node.js进行web开发时候，由于要用到各种包，不管是自己写的模块还是install进来的，一般都会用到一个Node.js的包引入关键字`module.exports`和`require`；但是对其module模块的加载机制其实我不是特别的清楚，只是会用；
只是了解其有缓存机制，一般只要`require`完一个模块后，其他地方再`require`进来一个模块后会有些不同缓存的结果。如：

``` javascript
// cache.js
const Cache = function() {
  console.log('init here!!');
}
var cache = new Cache();

module.exports = {
  cache
}

// a.js
const cache = require('./cache') //会打印出 'init here!!'

// b.js
const cache = require('./cache') // 不会打印出 'init here'
```
但是对其具体的模块机制没有个整体的认识，今天就着重看看Node.js模块的机制，同时也对比javascript 标准的ES6中包引入机制的差别。
<!--more-->

## Node.js module机制
Node.js总的加载顺序入下所示：
``` bash
require(X) from module at path Y
1. If X is a core module,
   a. return the core module
   b. STOP
2. If X begins with '/'
   a. set Y to be the filesystem root
3. If X begins with './' or '/' or '../'
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
4. LOAD_NODE_MODULES(X, dirname(Y))
5. THROW "not found"

```
#### 缓存
Node.js 模块第一次调用`require`加载完成后就将其缓存起来，多次`require`同一个模块不会使得该模块的代码被多次执行。
如下面代码：

`m.js`:

``` javascript
console.log('m.module init');
exports.m = function() {}
```
`main.js`:

``` javascript
var m = require('./m.js')
var n = require('./m.js')
console.log(m===n)
```
运行结果：
```
m.module init
true
```
由此可知多次require同一个模块，只是取第一次的缓存，并且两者是一致的引用,是一种单例模式

*note:*
`exports`和`module.exports`其实是同一个对象，但是如果将引入方式写成下面的注意变化

`m.js`:

``` javascript
console.log('init m')
var m = 'hello world'
function addString(h) {
  m += h
}
module.exports = {
  m: m,
  addString: addString
}
```

`main.js`:

``` javascript
  var m = require('./m')
  var m1 = require('./m')
  m.addString('java')
  console.log(m.m)
  console.log(m1.m)
  var m2 = require('./m')
  console.log(m2.m)
```

运行结果：
```bash
init m
true
hello world
hello world
hello world
```


#### 循环依赖
在这里会有循环依赖的情况发生，Node.js包机制怎么处理的呢，比如一个`a.js`里引入了`b.js`,而`b.js`里又引入了`a.js`,这样就产生了循环依赖的情况，要是我们自己想下，这里该怎么处理呢，比如程序里有
``` javascript
var m = require('./a.js')
```
这里主程序会引入`a`模块，`a`又引入`b`模块，但是`b`模块代码里又执行引入`a`模块的代码，其实这里就是`a`模块被引入多次，取第一次load的缓存。其实不会出现循环依赖的死循环

`a.js`:

``` javascript
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```

`b.js`:

``` javascript
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
```

`main.js`:

``` javascript
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done=%j, b.done=%j', a.done, b.done);
```

运行结果为：
``` bash
$ node main.js
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done=true, b.done=true
```


## ES6机制

先熟悉[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)的模块加载方式吧，AMD(Asynchronous Module Definition)采用异步的加载模块，这个很适合在浏览器环境下`require([module], callback)`等`module`加载完成后会执行`callback`回调；
ES6的加载方式就集合了`CommonJS`和`AMD`两种加载方式：
- 和`CommonJS`相似，都支持单一引入和循环依赖
- 和`AMD`相似，支持异步加载模块，和'configurable module loading'(不懂啥作用)

### 用法：
``` javascript
// -------- m.js -----------
var java = 'java'
const node = 'node'
function caller () {

}
// import {java} from './m'    --> java = 'java'
// import * as test from './m' --> test = {java, node, caller}
// import java from './m'      --> java = undefined (这里其实是要获取 export default)
export {java, node, caller}

// import {java} from './m'    --> java = 'java'
// import * as test from './m' --> test = {java, node, caller}
// import java from './m'      --> java = {java, node, caller}
export default {java, node, caller}    

// 错误的写法
export java

// import {foo} from './m'     --> foo = 9000
// import foo from './m'       --> foo = undefined (这里要获取 export default )
export var foo = 9000

// 错误写法
export defautl var def = 'default'

// 正确的写法
export default foo;
export default 'Hello world!';
export default 3 * 7;
export default (function () {});
export default class MyClass {}
```
由于ES6机制写入javascript语言里，和上面两者又有些改善：
- 语法较`CommonJS`更紧凑
- 可以静态分析(包括静态检查和优化等)
- 比`CommonJS`更好的支持了循环依赖

ES6 `export` `import`机制由于是静态的，所以不能在js代码里条件性的引入包，同时包引入会被提升，无论`import`写在什么位置都会被提升到当前作用域的最前端。

``` javascript
//------ a.js ------
var b = require('b');
function foo() {
    b.bar();
}
exports.foo = foo;

//------ b.js ------
var a = require('a'); // (i)
function bar() {
    if (Math.random()) {
        a.foo(); // (ii)
    }
}
exports.bar = bar;

```
若果先引入`a.js`的话，调用`a.bar()`直接报：`Maximum call stack size exceeded`,在引入`a.js`完成前，`b.js`不能获取`a.foo`，但是一旦`a.js`加载完成，（ii）就可以执行了；就造成了循环调用的问题。

而ES6的写法：
``` javascript
//--------- a.js ----------
import {bar} from 'b'; (i)
export function foo() {
  bar()
}

//-------- b.js ----------
import {foo} from 'a';
export function bar() {
  foo()
}
```

在ES6 `imports`是可以实时显示`exported`的值
如代码：
``` javascript
//------ lib.js ------
export let counter = 3;
export function incCounter() {
    counter++;
}

//------ main1.js ------
import { counter, incCounter } from './lib';

// The imported value `counter` is live
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```
