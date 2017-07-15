---
title: async的源码学习(奇技淫巧)
date: 2016-09-18 22:45:51
tags: ['javascript', '奇技淫巧']
---
## 前言
>async是一个Node.js的流程控制的库，最开始是用来消除Node.js的回调hell而引入的库；虽然其是主要基于Node.js而写的库，但是在浏览器也能适用；
通过以下安装：
``` bash
npm install async
bower install async
```
其代码实现很是精髓，各种javascript高级技巧，作者运转自如，玩耍的high；值得我去学习。
代码地址：[https://github.com/caolan/async/tree/1.0.0](https://github.com/caolan/async/tree/1.0.0)

## iterator的方法探究
``` javascript
async.iterator = function (tasks) {
     var makeCallback = function (index) {
         var fn = function () {
             if (tasks.length) {
                 tasks[index].apply(null, arguments);
             }
             return fn.next();
         };
         fn.next = function () {
             return (index < tasks.length - 1) ? makeCallback(index + 1): null;
         };
         return fn;
     };
     return makeCallback(0);
 };
```
<!--more-->
适用范例：
``` javascript
var iterator = async.iterator([
  function(val1) {console.log(val1)},
  function(val2) {console.log(val2)}
]);
var iterator1 = iterator('jvm');
'jvm';
var iterator2 = iterator1('her');
'her'
```
> async.iterator(tasks)先闭包持有tasks数组，第一次执行的时候返回 makeCallback(0)为fn的函数，fn()开始执行，执行结束后又返回下一个fn函数；makeCallback函数实现了自己的循环调用，貌似还有尾递归的影子；
写出这样的淫荡的代码，真的够我学习玩耍好久~~~~

## waterfall的方法探究
``` javascript
async.waterfall = function (tasks, callback) {
        callback = callback || noop;
        if (!_isArray(tasks)) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = noop;
                }
                else {
                    var args = _baseSlice(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };
```
使用范例
``` javascript
async.waterfall([
    function(callback) {
        callback(null, 'one', 'two');
    },
    function(arg1, arg2, callback) {
      // arg1 now equals 'one' and arg2 now equals 'two'
        callback(null, 'three');
    },
    function(arg1, callback) {
        // arg1 now equals 'three'
        callback(null, 'done');
    }
], function (err, result) {
    // result now equals 'done'    
});
```
