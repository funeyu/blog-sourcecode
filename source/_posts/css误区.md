---
title: css误区
date: 2017-04-20 23:00:25
tags: ['css', '集锦', '误区']
---

## absolute的定位

> 都知道absolute定位是相对最近的一个`position:absolute | fixed | relative | sticky`父级元素定位的；一直就觉得只要是`absolute`定位的元素一定要按照前面提及的定位方式，比如一个`div`里含有一个`absolute`定位的元素，设置`left`后才有相对其包含块的左边距，只设置一个的时候，只是左边距是相对包含块，同时设置了`top`的时候才会有平时的定位用法；
