---
title: 200行javascript代码实现MVC前端框架(一)
date: 2015-12-29 21:17:55
tags: ['Javascript', 'MVC', '前端', '翻译']
---
[Create Javascript MVC Framework in less than 200 lines (part-1)](http://www.aptuz.com/blog/create-javascript-mvc-framework/)
![](/img/posts/javascript_mvc.png)<!--more-->

## Why ？
如果你有一大型的应用，在写javascript代码的时候需要考虑到健壮和安全性的时候，你可以应用流行的框架如Angular JS,Knockout JS, Backbone JS等
但是如果你的应用是小型应用式，且要自己写有健壮性与安全性的代码的时候，就可以自己使用MVC模式。
当自己实现MVC框架的时候需要考虑以下的内容

## What ？
+ 路由与控制器
+ 工厂模式（代码重用）
+ 常量
+ 模板加载与绑定
+ 模块的灵活集成

所以，让我们一步一步地实现吧
1. 知晓javascript函数的'return'关键字
2. javascript的类与对象的概念
3. 知晓javascript的设计模式
4. 勾画自己的框架蓝图
5. 工厂模式的概念
6. 变量池的概念
7. 依赖注入的概念
8. 路由与控制器的概念
9. 样例app代码

### 1.'return'关键字
在javascript函数里，其返回值都将作为一个共有(public)的变量；
例子：
``` javascript
function getAValue(){
  var a = 10;
  return a;
}
```
"getAValue"函数里a是个私有变量，但是可以通过返回值获取到它
``` javascript
var new_a = getAValue();
console.log(new_a);
```
输出：
``` javascript
10
```
返回对象：
``` javascript
function getAnObject(){
  var Obj = {
    'key1': 'val1',
    'key2': 'val2'
  }

  return Obj;
}
var new_obj = getAnObject();

console.log(new_obj);
```
输出：
``` javascript
{'key1':'val1','key2':'val2'}
```
返回一个函数:
``` javascript
function getAFunction(){

  var func = function(){
    console.log("我是个私有的函数");
  }

  return func;
}

var new_func = getAFunction();
console.log(new_func);
```
输出：
``` javascript
function(){
  console.log("我是个私有的函数");
}
```
返回带有函数的对象：
``` javascript
function getFunction(){
  var funcs = {
    'func1': function(){
      console.log("im func1");
    },

    'func2': function(){
      console.log("im func2");
    }
  }

  return funcs;
}

var new_funcs = getFunctions();
console.log(new_funcs);
```
输出：
``` javascript
{func1: function(){ console.log("im func1")}, func2: function(){ console.log("im func2") }}
```

### 2.对象和私有性的概念
javacript中有不同方式去创建一个对象。函数是一个第一等的对象。这使得我们可以利用javacript很多其他语言没有的特性，例如可以将函数作为参数传递给其他函数或者作为返回值返回。
同时function也在创建对象有特殊作用，因为对象需要constructor函数间接或直接地创建自身

**Object**
javaScript最主要的是对象，Arrays 是对象，Functions是对象，Objects也是对象。那到底什么是对象呢?Objects是一个name-value对的集合，names是Strings,values是Strings,numbers,booleans和(包括arrays和functions)。Objects通常用哈希表来实现，这样可以快速定位到values
如果value是 function，我们就称之为方法。当一个对象的方法被调用时，`this`的变量就被设置成那个对象，那方法可以通过`this`变量获取对象实例上的变量属性
对象可以通过初始对象的constructors来构造，constructors提供了像其他语言的'类'的特性，包括静态变量和方法

**Public**
一个对象的成员变量都是公共属性。任何一个函数都可以获取，修改，删除这些属性，或者添加新的属性。有两个方法存储成员变量于一个新对象里：
1. 在constructor
  这一般用来初始化对象实例的公共变量，constructor的this变量用来添加添加成员变量到该对像。
  ``` javascript
  function Container(param){
    this.member = param;
  }
  ```
  所以，当我们创建一个新的对象时候
  ``` javascript
  var myContainer = new Container('abc');
  then myContainer.member contains 'abc'
  ```
2. 在prototype
  这一般是添加公共的方法，当搜索一成员属性时，在对象自身没找到就会去查询对象的constructor的prototype成员属性。
  原型链机制可以用来做继承。为了给所有由一个constructor生成的所有对象添加方法，给constructor的prototype添加相应的方法就行：
  ``` javascript
  Container.prototype.stamp = function(string){
    return this.member + string;
  }
  So, we can invoke the method
  myContainer.stamp('def')
  which produces 'abcdef'.
  ```

**私有**
私有成员变量由constructor创建。var定义的变量，constructor的参数都是私有的成员属性
``` javascript
function Container(param){
  this.member = param;
  var secret = 3;
  var that = this;
}
```
这个constructor生成三个私有的实例变量：param，secret和that 他们都是依附在该对象上，但是却不能在外面获取到。
也不能由对象的公共方法获取到。他们只被内部的私有属性的方法获取，而私有方法是constructor的内部函数。
``` javascript
function Container(param){

  function dec(){
    if(secret > 0){
      secret = -1;
      return true;
    } else {
      return false;
    }
  }

  this.member = param;

  var secret = 3;

}
```
私有方法dec检测变量secret,如果大于0则减1并返回true,否则返回false。这可以用来限制对象只使用三次
一般地，为了可以使得私有方法能获取到对象本身，我们生成一个`that`的私有变量。这是ECMAScript导致`this`在内部私有函数设置错误的一个变通
私有方法不能被公共方法调用。为了使得私有方法有效，需要介绍一个特权方法

**特权**
一个特权方法可以获取到私有变量和私有方法，并且自身对象的公共方法或被外部获取。可以删除或者替代特权方法，但是不能改变或者放弃其私有性
特权方法在constructor里被分配this上
``` javascript
function Container(param){

  function dec(){
    if(secret > 0){
      secret -= 1;
      return true;
    } else {
      return false;
    }
  }

  this.member = param;
  var secret = 3;
  var that = this;

  this.service = function(){
    return dec() ? that.member:null;
  };
}
```
service 是个特权方法。前三次调用`myContainer.service()`将返回'abc'，后面的调用将返回null。
service方法调用私有dec方法，该方法使用`secret`私有变量,service方法可以被其他对象或者方法使用，但是service方法不能直接去使用私有变量；

**下面部分将讨论设计模式并架构我们的框架**
