---
title: babel转换ES module
date: 2017-09-12 23:36:25
tags: ['babel', 'Module']
---

## Babel转换ES2015 modules的例子

输入：
``` javascript
export default 30;
```
转换成了：
``` javascript
Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = 42
```

可以看出来:每次export都是在`exports`上挂载一些属性，并有一个`__esModule`的字段标识是否是es6的moudle；


import的过程：

``` javascript
import assert from 'assert'
assert(true)
```
被转换成的代码：
``` javascript

function _interopRequireDefault(obj) {
  return obj && obj.__esModule
         ? obj
         : {'default': obj}
}

var __assert = require('assert');
var __assert2 = _interopRequireDefault(__assert)
(0, __assert2['default'])(true)
```
转换的代码，看出啥，如果是ES6的module就直接返回babel通过require方式引入的module，如果是符合CommonJS规范的就直接返回{default: obj};
