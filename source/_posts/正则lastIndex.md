---
title: 正则lastIndex
date: 2017-11-11 20:55:25
tags: ['正则'']
---
## 前言
最近在写自己的小项目，用到正则的`exec`，利用正则的`lastIndex`属性，遇到一个坑：

```javascript
var re = /^\s*\(/g;

re.exec("()") // 返回的是["(", index: 0, input: "()"]

// 这里是出错了, 返回的是null
re.exec("()")
```
上面其实是自己没有能够理解`re.exec`中`lastIndex`的含义，误以为，只是代表匹配一次的结束位置，只要每次执行`exec`就直接更新`lastIndex`,其实不是的。

## 解释
`lastIndex`其实是指下一个匹配的索引值，不是简单代表匹配一次的结束位置，其实也表示下一次开始的位置；
于是上面例子中的第二个匹配是从`()`的1索引值及`)`开始匹配，匹配为空；
`lastIndex`在一个字符中多次执行`exec`是有用的；如：
```javascript
var script = /script,\s+/g;
var test = 'script,  script,    script'

script.exec(test)
console.log(script.lastIndex) // 9

script.exec(test)
console.log(script.lastIndex) // 20
script.exec(test)
console.log(script.lastIndex) // 0

```

要想达到一开始例子中的效果，可以每次都将`lastIndex = 0`，即`re.lastIndex=0`,这样子就使得匹配从字符的首字母开始匹配；

```javascript
var re = /^\s*\(/g;

re.exec("()") // 返回的是["(", index: 0, input: "()"]

re.lastIndex = 0;

re.exec("(xxx)");
```