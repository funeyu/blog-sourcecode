---
title: css的span的坑
date: 2016-03-15 17:33:32
tags: ['css', 'span', '前端']
---

## span的一次掉坑经历
> 最近一次写html代码，用span元素,出现奇怪的现象，导致自己掉坑里有些找不到北,在此记录下，备忘啊!!html代码如下 <!--more-->
``` html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="page.css">
    <style>
    </style>
  </head>
  <body>
    <div>
      <span class="node">缘起</span>　
      <span class="node">方法</span>
      <span class="node">授之以渔</span>
    </div>
  </body>
</html>
```
> ``` css
  .node{
    display: inline-block;
    height: 30px;
    width: 120px;
    border: 1px solid #888;
    text-align: center;
  }
  ```
最终布局结果如下图,一二span间隔与二三span间隔不一致
![](/img/posts/spacing.png)

## span的换行隐形的空隙
span作为内链元素在回车换行会多出一个空白的间隙，要想去除span间的间隙可以使得span不换行，做一行处理，这样可以消除span间的间隙；或者每个span都设置float：left属性；
## 自己遇到的坑
此处在＂缘起＂与＂方法＂间的span换行的时候不小心多打了个中文的空格，造成了两者间的间隔与其他的间隔不一致的问题；
