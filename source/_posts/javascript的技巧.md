---
title: javascript的技巧
date: 2016-08-26 00:04:47
tags: ['javascript', '技巧', '备忘录']
---
## 判断boolean的知识总结
> 1. 当变量为空字符串时候，判断该变量时候返回false
2. 当变量不为空时候，可以通过`!!`操作符来转换该值为boolean类型（true或者false）,如
``` javascript
try {
 throw new Error();
} catch (e) {
 console.log(!!e.stack);
}
```
打印的即为：true
<!--more-->
## 链式调用的两种写法：
- 通过返回`this`的变量，不断针对同一个对象进行链式调用
``` javascript
// 实现
function Fetcher() {
  this.urls = [];
}
Fetcher.prototype.init = function(url) {
  this.urls.push(url);
  return this;
}
Fetcher.prototype.filter = function(extract) {
  this.urls = this.urls.filter(extract);
  return this;
}
Fetcher.prototype.allData = function() {
  return this.urls;
}
var f = new Fetcher();
f.init('http://aliyun.com').init('http://didi.com').init('http://di.com')
 .filter(function(url){return url.length > 15})
 .allData();
```
- 通过闭包，recursion来不断生成对象形成链式调用
``` javascript
var defer = function(defered){
  var value, thens = [], defered = [];
  return {
    resolve: function(value){
      for(var i = 0, ii = thens.length; i < ii; i ++) {
        thens[i].fulfill(value);
      }
    },
    reject: function(reason) {
      for(var i = 0, ii = thens.length; i < ii; i ++) {
        thens[i].rejection(reason);
      }
    },
    then: function(fulfill, rejection) {
      thens.push({
        fulfill: fulfill,
        rejection: rejection
      });
      return defer();
    }
  }
}

//调用的方式
var Promise = defer();
setTimeout(function(){
  Promise.resolve(30000)
}, 3000);
Promise.then(function(value){
  console.log(value);
},null).then(
  function(value){console.log('second call');
});
//打印出3000但是’second call’没能打印出来；
//todo 实现真正的then链式调用~~
```
