---
title: java小知识点集合
date: 2016-2-17 16:53:07
tags: ['java','杂烩']
---
## static的犄角旮旯：
**static** 可以修饰类与方法，详述如下：
- **方法：**  static修饰的方法不能被override(即不能被修饰符@override),可以被隐藏(也可以被子类调用)，所以下面的代码`B.note`是本身的定
义,`C`调用note是调用`A.note()`方法；若将`A`中`static void note()`加上`final`关键字,该关键字会使得static的隐藏特性失效，所
以下面的`B.note`方法会出现编译错误；<!--more-->
``` java
public class A{
  static void note(){......}
}
public class B extends A{
  static void note(){......}
}
public class C extends A{
  note();
}
```
- **类：**  java没有static修饰的class，只有nested class 可以被static修饰， 当java的一个类为final 修饰，同时只有静态方法, 构造器被私有化
那么该类就可以被当成一个static的class；
类似的类应用于:工具类，不许实例化的类如java的Math类就是个例子；

## 内部类
**内部类是否可以访问外部类的private的属性和方法?**
``` java
public class Outer{
    private String outerName = "Outer";
    private void outerSay(){
      System.out.println(outerName + "says method");
    }

    class Inner{
      private String innerName = "innerName";
      private void innerSay(){
        System.out.println(outerName);
        outerSay();
      }
    }

    public static void main(String[] args) {
      Inner inner = new Outer().new Inner();
      inner.innerSay();;
      // Outer
      // Outersays method
    }
  }
```
> 内部类可以调用外部类的所有类型的变量与方法，而且outerClass可以通过innerClass的实例来调用其任一方法
