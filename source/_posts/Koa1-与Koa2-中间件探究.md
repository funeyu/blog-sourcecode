---
title: Koa1 与Koa2 中间件探究
date: 2017-04-17 23:11:06
tags: ['koa', '中间件']
---

koa的中间件执行流程像洋葱模型，和express的中间件执行顺序很不一样，express:middlewares数组一次popup出，知道执行到最后一个中间件，中间只要有response 返回，就中断next；而koa1的中间件是由generator组成的，执行顺序：从第一个中间件开始，遇到next进入下一个中间件，一直到最后一个中间件，再逆序执行直到第一个中间件

## koa1的中间件

> 前提知识：如下的代码执行 执行next的时候遇到yield * foo()将foo generator委托，最终执行 打印出如下：

``` javascript
function *foo(){
  console.log('foo');
  yield 'b'
  console.log('end foo');
}

function *next() {
  console.log('next');
  yield *foo()
  console.log('next end')
}
var g = next();
g.next();
g.next();
g.next();

// opuput:
// next
// foo
// end foo
// next end
```
<!--more-->

koa1的中间件列子：

``` javascript
app.use(function *(next) {
  var start = new Date()
  yield next
  var ms = new Date - start
  this.set('X-Response-Time', ms + 'ms')
})

```

其内部原理是：每次use的时候将gen放于middleware数组中，并且通过`koa-compose`， `co`库将这些中间组成fn, 然后没来一个请求都会讲fn作为回调函数来处理请求；

具体代码为：
``` javascript
app.use = function(fn){
  ...
  this.middleware.push(fn);
  return this;
};

app.listen = function(){
  debug('listen');
  var server = http.createServer(this.callback());
  return server.listen.apply(server, arguments);
};

// 返回一个经过co 和compose处理后的函数
app.callback = function(){
  if (this.experimental) {
    console.error('Experimental ES7 Async Function support is deprecated. Please look into Koa v2 as the middleware signature has changed.')
  }
  var fn = this.experimental
    ? compose_es7(this.middleware)
    : co.wrap(compose(this.middleware));
  var self = this;

  if (!this.listeners('error').length) this.on('error', this.onerror);

  return function handleRequest(req, res){
    res.statusCode = 404;
    var ctx = self.createContext(req, res);
    onFinished(res, ctx.onerror);
    fn.call(ctx).then(function handleResponse() {
      respond.call(ctx);
    }).catch(ctx.onerror);
  }
};

// 将中间件数组合成一个fn函数
// 如 middleware为[
// function *gen1(next) {
//   do1();
//   yield next;
//   after1();
// },
// function *gen2(next) {
//   do2();
//   yield next;
//   after2();
// }]
// 经过compose拼装成 function *(next){yiled *start();}
// var start = function* (next) {
//  do1();
//  yiled *gen2()
//  after1();
// }
//然后co将compose组装成的generator自动执行，形成了洋葱模型中间件调用方式
//
// 实现原理很简单将middleware 数组中的generator倒序依次以参数next传给上一个generator
// 最后返回一个generator函数 yield 第一个middleware的generator， 每个middleware的next参数都是下一个generator的委托
function compose(middleware){
  return function *(next){
    var i = middleware.length;
    var prev = next || noop();
    var curr;

    while (i--) {
      curr = middleware[i];
      prev = curr.call(this, prev);
    }

    yield *prev;
  }
}

```

可以看出来koa1的中间件是通过generator的消息委托机制来实现成洋葱模型，next参数就代表middleware中的下一个插件，通过yield next进入到下一个middleware；

## koa2的中间件

koa2去除generator的方式，而已async wait的方式来实现中间件模式开发，每个中间件都是返回一个Promise的函数，并且每个Promise里都会有next()的调用来指代下一个中间件，列如：

``` javascript
function log(ctx) {
  console.log(ctx.method, ctx.header.host + ctx.url)
}

module.exports = function() {
  return function(ctx, next) {

    return new Promise((resolve, reject) => {
      log(ctx);
      resolve();
      return next();
    }).catch((err)=> {
      return next();
    })
  }
}
```

async 中间件在koa2中的使用
``` javascript
const Koa = require('koa')
const loggerAsync = require('./middleware/logger-async')
const app = new Koa()

app.use(loggerAsync())
```

也可以写成如下格式：

``` javascript
app.use(async (ctx, next) => {
  const start = new Date()

  var ms;
  try {
    await next();
    ms = new Date() - start

    logUtil.logResponse(ctx, ms)
  } catch (e) {
    // 记录异常到日志中
    logUtil.logError(ctx, error, ms)
  }
})
```

实现源码为：

``` javascript
callback() {
  const fn = compose(this.middleware);

  if (!this.listeners('error').length) this.on('error', this.onerror);

  const handleRequest = (req, res) => {
    res.statusCode = 404;
    const ctx = this.createContext(req, res);
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    return fn(ctx).then(handleResponse).catch(onerror);
  };

  return handleRequest;
}

function compose(middleware) {
  // 错误处理
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  return function(context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)

    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      // 当前执行第 i 个中间件
      index = i
      let fn = middleware[i]
      // 所有的中间件执行完毕
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()

      try {
        // 执行当前的中间件
        // 这里的fn也就是app.use(fn)中的fn， 每次中间件里执行next()的时候就开始调用dispatch(i+1)的方法
        return Promise.resolve(fn(context, function next() {
          return dispatch(i + 1)
        }))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

原理分析：这里运用的是递归调用的方式实现中间件的洋葱模型和koa1很不太一样，一般在await next(), 而每次next执行的方法都会返回一个Promsie,await Promise 就是等待该Promise resolve返回，当然也可以通过外层的try catch来捕获Promise的reject信息；这样子只要中间有一个reject的promise直接返回Promise.reject(err)不去执行dispatch(i+1)这样子就不递归下去了；否则会一直递归到最后一个中间件
