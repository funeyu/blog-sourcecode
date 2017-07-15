---
title: promise的个人实现的记录
date: 2016-09-11 20:25:57
tags: ['promise', 'javascript']
---
## promise 0.10版本
+ 每个`then`方法都返回一个Promise对象，前后两者Promise实例连接的方式来形成Promise链，实现方法为：每个Promise对象持有`nextPromise`属性，记录该Promise链的下一个Promise对象；
+ 根据`then`方法返回结果判断进行相应的操作，若返回的是Promise对象就将该`then`方法之后的Promise链接到新返回的Promise对象上
> 注意一点： 在new Promise对象的时候，若`thenable`参数为true，则说明是then里返回的Promise，不立马执行；
