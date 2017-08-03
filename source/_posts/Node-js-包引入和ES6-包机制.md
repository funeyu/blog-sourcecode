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
## ES6机制
## 对比
