---
title: 200行javascript代码实现MVC前端框架(三)
date: 2016-01-06 14:38:27
tags: ['Javascript', 'MVC', '前端', '翻译']
---
[Create MVC framework(Implement the structure)part3](http://www.aptuz.com/blog/create-mvc-frameworkimplement-the-structurepart3/)
![](/img/posts/javascript-mvc-implement.png)
<!--more-->
迄今为止，我们已经有构建一个MVC框架的基础知识，也已经设立MVC的结构。

**让我们回想下规则**
1. 需将重复的代码用工厂模式实现，并且每个工厂若是有依赖关系可以能引入
2. 这些工厂必须在项目加载的时候就已经实例化
3. 常量可以在控制器或者工厂等任意组件里修改
4. 我们需能定义路由用来标示路由来自哪里并且执行相应的控制器
5. 控制器是一些可以引入常量， 工厂的函数，且映射相关的url链接
6. 这些控制器必须在一特定的url到来的时候就开始执行

## 第一步：
 保存一个私有的json对象来持有所有的工厂，变量， 路由和控制器
 例子：
 ``` javascript
 var MiApp = (function(){
   'use strict';

   //private data
   var Resource = {
     'constants': {},
     'factory': {},
     'mode': null,
     'root': '/',
     'routes': [],
     'controller': {},
     'controller_dependancy': {}
   }

   function constants() {
     var key = arguments[0],val = arguments[1];
   }
   function routes(){
     var key = arguments[0],val = arguments[1];
   }
   function controller(){
     var key = arguments[0],val = arguments[1];
   }
   function factory(){
     var key = arguments[0],val = arguments[1];
   }
   return {
     'factory': factory,
     'routes': routes,
     'controller': controller,
     'constants': constants
   }
 });
 ```

## 第二步：
保存一适配器用来给公共函数提供私有函数的访问。这个适配器就是我们实际要实现的的资源对象
``` javascript
var api = {
  'factory': function(key, arrayArg){

  },
  'routes': function(route, controller){

  },
  'controller': function(controller, handler){

  },
  'constants': function(key, val){

  },
  'loadDependancies': function(arrayArg){

  }
}
```

## 变量
``` javascript
app.constants('name', function(){
  return{

  }
});
```
**预设的规则：**
常量可以在控制器或者工厂等任意组件里修改。常量可以是函数，对象或者hybird。所以每当创建一个常量，就需要通过适配器将该常量值作为key/value的存储在Resource的一个属性上
``` javascript
'constants': function(key, value){
  resources.constants[key] = val();
}
```

## 依赖注入的概念
为了可以创建在其他的工厂下可以使用的工厂或者常量，这里我们可以需要将这些依赖注入到这个工厂中；
**怎么注入一个常量到工厂中**
我们持有一个私有对象Resource,通过名称来保存常量。假设现在已经创建了一个名叫'constant1'的常量。
现在如果要将该变量注入到工厂中，可以通过Resource.constants[constant1]获取
``` javascript
app.factory('factory1', ['constant1', function(constant1){
  return {
    'publicAccess': function(){
      console.log(constant1);
    }
  }
}]);
```
现在创建个提供基于key获取工厂和常量适配器函数
``` javascript
'loadDependancies': function(arrayArg){
  var dependancy = [], iter;
  for(iter = 0; iter < arrayArg.length; iter++){
    if(typeof arrayArg[iter] == "string") {
      // look in modules
      if(resources.hasOwnProperty(arrayArg[iter])){
        dependancy.push(api.loadModule(arrayArg[iter]));
      } else {
        //look in constants
        if(resources.constants.hasOwnProperty(arrayArg[iter])){
          dependancy.push(api.loadConstant(arrayArg[iter]));
        } else {
          // if it is $me scope
          if(arrayArg[iter] === "$mi"){
            dependancy.push({});
          } else {
            console.log("Error:" + arrayArg[iter] + "is not Found in constants and Factories");
          }
        }
      }
    }
  }

  return dependancy;
}
```
上述代码接收一keys 名字数组，相应地查找模块，工厂，常量。简单来说就是取出一个字符串数组，然后返回存储在私有对象的函数
``` javascript
'factory': function(key, arrayArg){
  var last_index = arrayArg.length - 1;
  var dependancies = arrayArg.slice(0, -1);
  if(typeof arrayArg[last_index] === "function"){
    resources.factory[key] = arrayArg[last_index].apply(this, api.loadDependancies());
  } else {
    console.log("Nan");
  }
}
```

## 路由的概念
**预设的结构**
``` javascript
// routes
app.routes('routeurlwithregularexpression', 'controller');

// controller
app.controller('TestController', ['dependancy1', 'dependancy2', function(dependancy1, dependancy2){
  // your staff that runs when the page gets loaded
}]);
```

## 控制器的概念
控制器是一能加载相关依赖的模块，当特定url到来的时候，该控制器需被加载
``` javascript
'controller': function(controller, handler){
  var last_index = handler.length - 1;
  var dependancies = handler.slice(0, -1);
  if(typeof handler[last_index] === "function"){
    resources.controller[controller] = handler[last_index];
    resources.controller_dependancy[controller] = dependancies;
  } else {
    console.log("Nan");
  }
}
```


## 附全部代码
``` javascript
var mi = (function () {
    'use strict';
    var resources = {
        'filters' : { },
        'constants' : { },
        'factory' : { },
        '$me' : { },
        'mode' : null,
        'root' : '/',
        'routes' : [],
        'controller' : { },
        'controller_dependancy':{ },
        'config': function(options) {
            resources.mode = options && options.mode && options.mode == 'history'
                        && !!(history.pushState) ? 'history' : 'hash';
            resources.root = options && options.root ? '/' + resources.clearSlashes(options.root) + '/' : '/';
        },
        'getFragment': function() {
            var fragment = '';
            if(resources.mode === 'history') {
                fragment = resources.clearSlashes(decodeURI(location.pathname + location.search));
                fragment = fragment.replace(/\?(.*)$/, '');
                fragment = resources.root != '/' ? fragment.replace(resources.root, '') : fragment;
            } else {
                var match = window.location.href.match(/#(.*)$/);
                fragment = match ? match[1] : '';
            }
            return resources.clearSlashes(fragment);
        },
        'clearSlashes': function(path) {
            return path.toString().replace(/\/$/, '').replace(/^\//, '');
        },
        'check': function (hash) {
            var reg, keys, match, routeParams;
            for (var i = 0, max = resources.routes.length; i < max; i++ ) {
                routeParams = {}
                keys = resources.clearSlashes(resources.routes[i].path).match(/:([^\/]+)/g);
                match = hash.match(new RegExp(resources.clearSlashes(resources.routes[i].path).replace(/:([^\/]+)/g, "([^\/]*)")));
                console.log(resources.routes[i].path);
                if (match) {
                    match.shift();
                    match.forEach(function (value, i) {
                        routeParams[keys[i].replace(":", "")] = value;
                    });
                    var LDependancy = api.loadDependancies(resources.controller_dependancy[resources.routes[i].handler]);
                        LDependancy.push(routeParams);
                        resources.controller[resources.routes[i].handler].apply(this, LDependancy);
                        break;
                }
                else{
                    if(resources.clearSlashes(resources.routes[i].path) == hash){
                        //load dependency and call
                        var LDependancy = api.loadDependancies(resources.controller_dependancy[resources.routes[i].handler]);
                        resources.controller[resources.routes[i].handler].apply(this, LDependancy);
                        break;
                    }
                }
            }
        },

        'listen': function() {
            var current = "/";
            var fn = function() {
                // console.log("..");
                if(current !== resources.getFragment()) {
                    current = resources.getFragment();
                    resources.check(current);
                }
            }
            if(resources.mode == 'hash'){
                clearInterval(this.interval);
                this.interval = setInterval(fn, 50);
            }
            if(resources.mode == 'history'){
                this.interval = setTimeout(fn, 50);    
            }
        },
    }, api = {
        'filters': function (key, val) {
            resources.filters[key] = val;
        },
        'factory': function (key, arrayArg) {
            var last_index = arrayArg.length-1;
            var dependancies = arrayArg.slice(0, -1);
            if (typeof arrayArg[last_index] === "function") {
                console.log("-"+api.loadDependancies(dependancies));
                resources.factory[key] = arrayArg[last_index].apply(this, api.loadDependancies(dependancies)); // arrayArg[last_index];
            } else {
                console.log("Nan");
            }
        },
        'routes' :  function(route, controller){
            var temp = {'path':route, 'handler':controller };
            resources.routes.push(temp);
        },
        'controller' : function(controller, handler){
            var last_index = handler.length-1;
            var dependancies = handler.slice(0, -1);
            if (typeof handler[last_index] === "function") {
                resources.controller[controller] = handler[last_index];
                resources.controller_dependancy[controller] =  dependancies;
            } else {
                console.log("Nan");
            }
        },
        'loadDependancies' : function(arrayArg){
            var dependancy = [], iter;
            for (iter = 0; iter < arrayArg.length; iter += 1) {
                if (typeof arrayArg[iter] === "string") {
                    //look in modules
                    if (resources.hasOwnProperty(arrayArg[iter])){
                        dependancy.push(api.loadModule(arrayArg[iter]));
                    } else {
                    //look in factory
                    if (resources.factory.hasOwnProperty(arrayArg[iter])) {
                        dependancy.push(api.loadDependancy(arrayArg[iter]));
                    } else {
                            //look in constants
                            if (resources.constants.hasOwnProperty(arrayArg[iter])) {
                                dependancy.push(api.loadConstant(arrayArg[iter]));
                            } else {
                                //if it is $me scope
                                if (arrayArg[iter] === "$mi") {
                                    dependancy.push({});
                                } else {
                                    console.log("Error: " + arrayArg[iter] + " is not Found in constants and Factories");
                                }
                            }
                        }
                    }
                }
            }
            return dependancy;
        },

        'loadModule': function (key) {
            return resources[key];
        },

        'loadDependancy': function (key) {
            return resources.factory[key];
        },

        'loadConstant': function (key) {
            return resources.constants[key];
        },

        'constants': function (key, val) {
            resources.constants[key] = val();
        },

        'module': function(key, arrayArg){
            if(key.startsWith('mi')){
                var last_index = arrayArg.length-1;
                var dependancies = arrayArg.slice(0, -1);
                if (typeof arrayArg[last_index] === "function") {
                    console.log("-"+api.loadDependancies(dependancies));
                    resources[key.substring(3, key.length)] = arrayArg[last_index].apply(this, api.loadDependancies(dependancies)); // arrayArg[last_index];
                } else {
                    console.log("Nan");
                }
            }
            else{
                console.log("Error in module "+key+": should starts with mi");
            }
        }
    };


    function filters() {
        api.filters(arguments[0], arguments[1]);
    }

    function factory() {
        api.factory(arguments[0], arguments[1]);
    }

    function constants() {
        api.constants(arguments[0], arguments[1]);
    }

    function routes(){
        api.routes(arguments[0], arguments[1]);
    }

    function controller(){
        api.controller(arguments[0], arguments[1]);
    }

    function module(){
        api.module(arguments[0], arguments[1]);
    }

    function initiate(){
        resources.config({mode :'history'});
        resources.listen();

        if (typeof String.prototype.startsWith != 'function') {
          // see below for better implementation!
          String.prototype.startsWith = function (str){
            return this.indexOf(str) == 0;
          };
        }
    }

    initiate();

    return {
        'filters': filters,
        'factory': factory,
        'routes': routes,
        'controller': controller,
        'constants': constants,
        'module': module
    }
});

```
