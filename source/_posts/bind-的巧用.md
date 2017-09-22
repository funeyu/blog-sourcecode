---
title: bind 的巧用
date: 2017-09-22 23:04:45
tags: ['javascript', 'bind']
---
## 前言
> 最近在开发中，遇到一个需求，一个toast组件在另一上下文中使用，toast 的组件里又想用到另一上下文的其他一个或者多个变量，该怎么做呢？
<!--more-->

## 实现
我们知道一般如果是只用到一个变量的话，可以直接`bind(this, arg1)`来实现；如下代码，可以将`function(a){}`bind一个变量`var a = 'A'`;这样子弹窗点击执行的就是带有`here.js`下的`a`的变量过去；

``` javascript
// here.js
var a = 'A';

toast.show({
  onClick: (function(a) {
      // do with a
  }).bind(this, a)
})

```

但有时候会遇到的是：`onClick`的回调函数要有两个参数，其中一个是`here.js`下的一个变量，另一个却不是`here.js`下的，也就是说：两个参数不在同一个上下文中，不能一次全部`bind`过来，这个时候可以分两次`bind`操作，如:
``` javascript
// here.js
var a = 'A';
var combined = function(a, b) {
  // do something with a, b
}

toast.show({
  onClick: combined.bind(this, a)
})

// toast.js
var b = 'B'

doSomething() {
  let {onClick} = this.props     // 这里就是获取上面onClick的函数，点击弹窗就会
                                 // 执行doSomething函数

  onClick.bind(null, b)();       // 这里就相当于执行 combined('A', 'B');
}
```
>  MDN的解释：*bind()方法会创建一个新的函数，调用新函数的时候，新函数会以第一个参数为this，第二个及以后的参数都为新函数运行时候的参数，该参数和原函数的参数是一致的*

#### 注意点
+ 多次`bind`改变`this`的指向只在第一bind(a, args)时候起作用
如下代码：

``` javascript
var m = function() {
  console.log(this.x)
}
var n1 = m.bind({x: 'n1'})
// n1
n1()

var n2 = n1.bind({x: 'n2'})
// n1
n2()
```
