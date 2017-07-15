---
title: 为何javascript 中的call比apply会快些
date: 2016-05-18 23:06:58
tags: ['javascript', 'apply', 'call']
---
## 写在前面
> 最近看lodash.js的时候，经常会遇到将函数的上下文变换的情况，然后它就封装了一个函数
``` javascript
function apply(func, thisArg, args) {
  var length = args.length;
  switch (length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
```
<!--more-->
很纳闷怎么还要这么个写法；上网查[stackflow](http://stackoverflow.com/questions/23769556/why-is-call-so-much-faster-than-apply)才最终明白其中缘由！！！

## 知识搬运
**Function.prototype.apply(thisArg, argArray)，func.apply(thisArg, argArray)经历的操作：**
  1. 判断func函数是否可调用，不通过则抛出异常；
  2. 当argArray是null或者undefined,直接调用func的内部[[call]]方法；
  3. 当argArray不为object时候,抛异常；
  4. 获取argArray的长度；
  5. 将argArray长度转换成4byte的int并赋值给n；
  6. 循环迭代取出argArray:
    1. 先是赋值空的数组
    2. 赋值循环开始的下标index=0
    3. while(index++ < len)
    4. 将下标转换成String类型(这里为什么这么做呢，其实javascript里的数组和我们平常java或者c语言的数组不一样，后者都是分配一个固定长度的且紧邻空间作为存储，但是javascript确实通过hash的方式存储，即a=[1,2,3,4]你可以通过a['1']获取，实际上是以下标作为key的键值对)
    5. 然后依次取出类似数组里的内容，并将追加到之前的空数组， 并改变下标；
  7. 返回调用的结果；

  **Function.prototype.call (thisArg [ , arg1 [ , arg2, … ] ] )， func.call(...)经历的操作：**
  1. 判断func函数是否可调用，不通过则抛出异常；
  2. 先是赋值空的数组
  3. 函数参数个数的判断并相应追加到以上的空数组中
  4. 然后调用func,使用相应的参数数组，改变相应的函数上下文

  从上面可以看出，apply经历的操作就比较的繁杂些；并且apply不管参数的长度为多少都会进行迭代循环，这样子是比较耗时的，而call函数是已经将函数参数已经格式化成需要的格式，综上这些都会使得apply方法比call方法稍微慢些；
