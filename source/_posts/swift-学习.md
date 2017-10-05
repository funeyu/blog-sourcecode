---
title: swift 学习
date: 2017-10-04 21:04:00
tags: ['swift', '总结']
---
## 工具篇
+ Xcode 9添加图片到Assets.xcassets的方法：
点击开Assets.xcassets 在AppIcon 里拖图片，注意不要拖图片到项目导航里；

## swift 语言基础

一、swift语言里有两类属性变量：及存储属性和计算属性的变量；

 + 存储性的变量和之前的其他语言差不多,下面的name，和tel就是存储变量
 ``` swift
 struct Person {
   let name: String
   var tel: String
 }
 ```
 + 计算属性值，提供getter和setter的方法，间接设置或者改变值；下面的`Person`的`name`属性就是计算属性值，
 ``` swift
 class Person{
   var _name: String = ""
   var name: String {
     set(newName) {
       _name = newName
       // 各种其他操作
     }
     get{
       return _name
     }
   }
 }
 ```


 二、 swift中的协议`Protocol`
 swift语言中的协议和java中接口语义是相似的，协议可以采用多个其他的协议，协议里的可以明确的继承实现也可以选择性的继承实现，也可提供一个默认的协议实现（这个类似java的虚类，java新版本的也支持在interface中有实现方法与之类似）
 + 协议的语法：
 ``` swift
 protocol Some {
   // 协议的定义区域
 }
 ```
 + 协议的要求：每个协议的方法必须要实现，但是optional修饰的可以不用去实现,同时注意一点：`@objc`修饰的方法只能存在于类中，所以必须要在protocol中使用@objc修饰限制;
 ``` swift
 protocol Some {
   func random() -> String
 }

 class SomeP: Some {
   func random() -> String {
     return "random string !!!!"
   }
 }

 @objc protocal OSome {
   @objc optional func rr() -> String
 }
 class OP: OSome {
   //可以为空
 }
 ```
