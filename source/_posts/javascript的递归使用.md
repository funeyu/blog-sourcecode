---
title: javascript的递归使用
date: 2016-09-20 23:04:47
tags: ['javascript', '递归']
---
## 扯淡
> javascript被称为披着c语言外衣的lisp，从中可以隐隐闻出javascript语言的灵活，机动。在慢慢的学习使用javascript中，慢慢发现它虽然作为一门脚本解释型语言，虽没有java大刀的刀劲十足，但是也是足够的小巧，玩的好更能在一些程序开发上做到游刃有余，尤其是在现在大前端的前提下，javascript可以重写的地方貌似开始都要用javascript重写；  
javascript这么灵活，写起高逼格代码更是松松的，今天就开始用递归实现某些功能来。
<!--more-->
## json数据解析
- 问题，遍历json的自变量，提取出每个key/value属性，迭代取出并最终返回一个result
- 函数定义为`function extractData(fabrication, json)`，其中fabrication作为一个函数，用来提取每个json属性内容的一个函数，json是要提取的json对象；
``` javascript
function extractData(fabrication, json) {
  if(json && typeof json === 'object') {
    for(var k in json) {
      if(Object.prototype.hasOwnProperty.call(json, k)) {
        console.log(json[k]);
        extractData(fabrication, json[k])
      }
    }
  }
  else {
    fabrication(json)
  }
}

function extract(time) {
  if(time--) {
    extract(time);
  }
  else {
  console.log(time);
}
}
```
使用范例：
``` javascript
var json = {
  'node': 'nodejs',
  'java': [
    'ideaIntell', 'eclipse' , 3
  ],
  'arrays': [
    {
      'her': {
        name: 'mahai',
        sex: 'female'
      },
      'fu': {
        name: 'funer',
        sex: 'male'
      }
    }
  ]
}
var fab = (function() {
  var value = '';
  return {
    handle: function() {
      value = String.prototype.concat.apply(value, arguments);
    },
    value: function() {
      return value;
    }
  }
})();
extractData(fab.handle, json);
console.log(fab.value());
```
## 尾递归
``` javascript
function tco(f) {
    var value;
    var active = false;
    var accumulated = [];

    return function accumulator() {
        accumulated.push(arguments);

        if (!active) {
            active = true;

            while (accumulated.length) {
                value = f.apply(this, accumulated.shift());
            }

            active = false;

            return value;
        }
    }
}
//这种方式确实有点奇怪，但的确没有改动很多源码，只是以直接量的形式使用tco函数包裹源码
var sum = tco(function(x, y) {
    if (y > 0) {
      return sum(x + 1, y - 1)
    }
    else {
      return x
    }
});
sum(1, 10) // => 11
sum(1, 100000) // => 100001 没有造成栈溢出

```
