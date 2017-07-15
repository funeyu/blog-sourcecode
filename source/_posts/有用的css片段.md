---
title: 有用的css片段
date: 2016-05-04 01:45:06
tags: ['前端', 'css', '备忘录']
---
## 垂直居中的方法
1. **CSS3的写法：**
``` css
.container{
  position: relative;
}
.center{
  position:absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```
  `translate(x, y)`, `translateX(x)`, `translateY(y)`都是基于元素的基点位置移动物体,其基点位置默认为元素的中心点。
<!--more-->
2. ## table设置宽度：
``` css
.fixed-table{
  table-layout: fixed;
  #然后在设置th的宽度；
  word-break: break-all;#强制换行  
}
```
  ``` html
  <table class="table table-bordered fixed-table">
      <tr class="header">
          <th class="id">栏目1</th>
          <th class="bank-name">栏目2</th>
          <th class="bank-code">栏目3</th>
          <th class="remark">栏目4</th>
      </tr>
      <tr>
          <td>具体内容1</td>
          <td>具体内容2</td>
          <td>具体内容3</td>
          <td>具体内容4</td>
      </tr>
  </table>
  ```

3. ## css3实现的卡片效果底部的图形
  ``` css
  .wrapper {
    background: #fa3945;
    transform: rotate(180deg);
  }
  .wavy-line {
    width: 100%;
    height: 6px;
    background: -webkit-radial-gtadient(transpatent, transparent 6px, #fff 5px, #fff);
    background-size: 12px 10px;
  }
  ```
  ``` html
  <div class="wrapper">
    <div class="wavy-line"></div>
  </div>
  ```
  最终的结果为: ![](/img/posts/wavy.png)

  4. ## 不用float与display: inline-block实现水平对齐
  ``` html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
      <style>
        .list {
          display: flex;
          justify-content: space-between;
        }
        .list .person {
          flex-basis: 20%;
          height: 200px;
          border: 1px solid #ff6622;
        }
      </style>
    </head>
    <body>
    <div class="list">
      <div class="person"></div>
      <div class="person"></div>
      <div class="person"></div>
      <div class="person"></div>
      <div class="person"></div>
    </div>
    </body>
  </html>
  ```
