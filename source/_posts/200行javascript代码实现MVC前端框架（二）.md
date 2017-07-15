---
title: 200行javascript代码实现MVC前端框架（二）
date: 2016-01-02 22:18:15
tags: ['Javascript', 'MVC', '前端', '翻译']
---
[Create MVC Framework (Architect the Structure) part2](http://www.aptuz.com/blog/create-mvc-framework-architect-the-structure-part2/)
![](/img/posts/javascript_mvc_architecture.png) <!--more-->
在这篇文章我们将要学习设计模式与构建框架的相关知识

## 设计模式

**首先什么是模式，为什么用模式**

设计模式是在软件设计里针对经常出现的问题而提供的可重用的解决方案。在我们这个例子里，软件设计就是写出个javascript的web应用。设计模式也可以被当成解决问题的模板，同时该模板可以被用在各式各样不同的情况；

**Why**
设计模式是被验证后的解决方案：这些验证过能解决软件开发中问题的方法是由一些开发者经验和智慧的结晶
设计模式可以很容易的重用：一个设计模式，在自己的需求开发中可以做到开箱即用，这使得其很健壮
设计模式也可能需要大的代价：我们看到的一些设计模式，通常在解决方案上会使用一系列的结构和名词，这些都是用来较优雅地介绍解决方案；

**设计模式的范畴**
1. 生成的设计模式
2. 结构的设计模式
3. 行为的设计模式

记住在该目录下模式将代指'类'，javascript是个class-less的语言，但是可以利用function模拟出类
Patterns
 + 生成器模式(Constructor Pattern)
 + 块模式(Module Pattern)
 + 块隐藏模式(Revealing Module Pattern)
 + 单例模式(Singleton Pattern)
 + 观察者模式(Observer Pattern)
 + 中介模式(Mediator Pattern)
 + 命令行模式(Command Pattern)
 + 门面模式(Facade Pattern)
 + 工厂模式(Factory Pattern)
 + 混合模式(Mixin Pattern)
 + 装饰器模式(Decorator Pattern)
 + 享员模式(Flyweight Pattern)
 在此，不将介绍上面所有的模式，感兴趣的可以google相关知识点

 ## 关于module Pattern
 该模式是为了在传统的软件工程中提供私有和公有的类属性封装

 在JavaScript中，该模式被用来模拟类概念中的public/private属性，同时保护私有变量不受全局变量影响
 这使得函数的变量减少了冲突

 **Privacy**
 该模式通过闭包封装"私有性",状态，组织，其提供了一种将公有和私有方法及属性打包的方法，这样可以防止碎片似的变量不小心变成全局变量从而碰巧和他人的接口上的全局变量冲突
 用这个模式，只返回公共的API，其他的都在闭包中以私有方法或者私有属性存放
 例子🌰：
``` javascript
var testModule = (function(){
  var counter = 0;
  return {
    incrementCounter: function(){
      return counter ++;
    },
    resetCounter: function(){
      console.log("counter value prior to reset:" + counter);
      counter = 0;
    }
  };

})();
// Usage:

// Increment our counter
testModule.incrementCounter();

// Check the counter value and reset
// Outputs: counter value prior to reset: 1
testModule.resetCounter();
```

## 搭建框架
在最开始的图片看到流程中我们有常量池，工厂，路由器和控制器

**让我们立下写规则吧**
1. 需将重复的代码用工厂模式实现，并且每个工厂若是有依赖关系可以能引入
2. 这些工厂必须在项目加载的时候就已经实例化
3. 常量可以在控制器或者工厂等任意组件里修改
4. 我们需能定义路由用来标示路由来自哪里并且执行相应的控制器
5. 控制器是一些可以引入常量， 工厂的函数，且映射相关的url链接
6. 这些控制器必须在一特定的url到来的时候就开始执行

**创建App**
``` javascript
var app = MiApp();
```
**创建工厂**
``` javascript
app.factory('factory name', ['dependancy1', 'dependancy2', function(dependancy1, dependancy2){

  return {
    'publicAccess': function(){
      return "something"
    }
  }
}]);
```
**创建变量**
``` javascript
app.constants('constant name', function(){
  return {
    'item1': 'val1',
    'item2': 'val2'
  }
});
```
**创建路由**
``` javascript
app.routes('routeurlwithregularexpression', 'controllername');
//exmaple
app.routes('test/:id/', 'TestController');
```
**创建控制器**
``` javascript
app.Controller('TestController', ['dependancy1', 'dependancy2', function(dependancy1, dependancy2){
  // your stuff that runs when the page gets loaded
}]);
```
需要实现这些预设的MVC结构

+ 观察那些公有和私有的属性，如果MiApp 是一个模块那么它的公共的东西就该是：
  - Factory
  - Routes
  - Controller
  - Constants

所以需要构建Module pattern 使得上述内容公开
``` javascript
var MiApp = (function(){
  'use strict';

  function constants(){
  }

  function routes(){
  }

  function controller(){
  }

  function factory(){
  }

  return {
    'factory': factory,
    'routes': routes,
    'controller': controller,
    'constants': constants
  }
});
```
现在，我们观察下预设的结构并且读取每个预设结构的参数。详细点就是在每个组件(工厂，路由，控制器或者变量)中第一个参数作为key，第二个参数作为value
但是为了隐藏性，通过动态参数方式而不是通过固定格式的参数读取；
``` javascript
var MiApp = (function(){
  'use strict';

  function constants(){
    var key = arguments[0], value = arguments[1];
  }

  function routes(){
    var key = arguments[0], value = arguments[1];
  }

  function controller(){
    var key = arguments[0], value = arguments[1];
  }

  function factory(){
    var key = arguments[0], value = arguments[1];
  }

  return {
    'factory': factory,
    'routes': routes,
    'controller': controller,
    'constants': constants
  }
});
```
现在可以创建App像我们之前假定的格式了：
``` javascript
var app = MiApp()

app.factory('factory_name', ['dependancy1', function(dependacy1){

}]);

app.routes('url', 'controller_name');

app.controller('controller_name', ['dependacy1', function(dependacy1)]{

});

app.constants('name', function(){
  return {

  }
})
```
迄今为止，我们创建了我们需要的架构，但是还未真正的实现任何特性，下一篇文章将要讨论怎么去实现这些组件并且依赖注入的概念；
