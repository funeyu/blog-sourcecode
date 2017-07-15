---
title: z-index的深入理解
date: 2016-04-28 19:57:13
tags: ['css','z-index', '前端']
---
> 之前一直对z-index的知识算是一知半解，今天听了[慕课网张鑫旭的css深入理解之z-index](http://www.imooc.com/video/11624) 才算是慢慢把之前的知识理解清楚；

## Stacking order
![](/img/posts/context_order.png)<!--more-->
+ 上图显示了层叠的顺序，即z-index为正的覆盖 > z-index:0或为auto覆盖> inline元素覆盖 > float元素 覆盖 > 非定位的block元素 覆盖 > 负的z-index的元素 覆盖 > 对应的层叠上下文的backgroud/border
+ z-index 在不考虑css3 只有定位元素（position：relative/absolute/fixed）才起作用，position:static的元素不起作用

## 定位元素发生嵌套遵循的原则
 + 祖先优先的原则（index值为非auto的时候只有数字的时候）
 + (z-index: auto）

## 不依赖z-index值的css属性也具有层叠上下文
+ 根元素
+ 绝对定位或者相对定位且z-index值不为auto
+ z-index 不为auto的flex项
+ opacity值不为1的元素
+ transform的属性不为none的元素
+ mix-blend-mode属性不为normal的元素
+ filter的属性不为normal的元素
+ isolation 属性值为isolate的元素
  - isolation的使用：针对mix-blend-mode使用。当只想一个元素与其父级元素有混合效果不想与更上一级元素混合的时候，可以在父级元素上加isolation:isolute；阻断与上上级的混合；
  可以参考[http://www.zhangxinxu.com/study/201601/css3-isolation-isolate.html](http://www.zhangxinxu.com/study/201601/css3-isolation-isolate.html)
+ position: fixed的元素
+ will-change:上述属性  的元素
+ 设置-webkit-overflow-scrolling属性为:"touch"的元素

## 几个例子
图1(图片中的序号即为在dom流的顺序)：
![](/img/posts/stack-absolute.png)
图2(图片中的序号即为在dom流中的顺序)：
![](/img/posts/stacking-floating.png)
> + 图1：根据层叠上下文的7阶顺序，普通块状元素在float元素与z-index:auto下，由于除了DIV #4没有层叠上下文，其他都有层叠上下文，
一是绝对定位，二是opcity不为1；z-index值相等都为auto的情况下按照文档流的出现顺序进行覆盖，后面覆盖前面；
+ 图2: DIV#2与DIV#3两个元素由于是普通的float元素，根据层叠7阶顺序表，显示如图：都被层叠上下文DIV#5，DIV#3覆盖；

图3
![](/img/posts/stacking-orders.png)
> 层叠元素发生嵌套的话：根据祖先优先的原则;嵌套的元素与外界的层叠关系都由最外层的父级元素，不会出现外界元素覆盖父级元素而又被父元素子元素覆盖的情况；

## 参考资料
[Stacking and float](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/Stacking_and_float)
[The stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
