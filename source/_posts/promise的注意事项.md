---
title: Promise模式的注意事项
date: 2016-09-03 19:06:23
tags: ['promise', 'javascript']
---
## `then`的错误使用方法
``` javascript
function badAsync() {
  var promise = Promise.resove();
  promise.then(function() {
    // doSomething
    return newValue;
  });
  return promise;
}
```
> 注意一点，调用Promise的then方法就会生成一个新Promise对象；
如上的写法`return promise`返回的是promise变量，不是`.then(......)`新生成的Promise对象，这样子外部是不会捕捉到`.then(......)`里的异常的;
还有就算里面的`.then(.....)`有return 返回值，但是也不会被外层获取到;
应该的写法如下：
``` javascript
function asyncCall() {
  var promise = Promise.resolve();
  return promise.then(function() {
    // do something
    return newValue;
  });
}
```
<!--more-->
## `error`的处理方式
``` javascript
someAsyncCall.then(
  function() {
    return anotherAsyncCall();
  },
  function(error) {
    handleError(error);
  }
)
```
> 问题出现在`.then()`的第一个函数返回的异步函数，外层不能捕捉到相关错误，明朗的做法是将处理错误的函数独立出来，使用`.catch()`方法；
``` javascript
someAsyncCall.then(function() {
  return anotherAsyncCall();
}).catch(function(error) {
  handleError(error);
})
```
