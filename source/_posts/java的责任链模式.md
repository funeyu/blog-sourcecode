---
title: java的责任链模式
date: 2016-02-04 10:45:53
tags: ['java','设计模式','责任链']
---
## 责任链简介

**责任链模式**顾名思义就是有一连串的处理者`Handler`,每个处理者只负责其中一个或者一种类型的
任务`Task`，不是自己负责的任务就下发到下一个处理者，可以看出来这里的有多个处理者且组成了一个
链式的数据结构。<!--more-->

## 责任链实现

Handler 类是一个虚类，责任链每个处理者都该有next的方法，将共有的放在Handler的虚类中，并且
每个Handler要持有下一个对象，这里依赖抽象做到解耦。

``` java
public abstract class Handler {
	public Handler next;
	public void next(Task task){
		if(next != null){
			next.handle(task);
		}else{
			System.out.println("责任已经完成");
		}
	}
	public abstract void handle(Task task);
}
```

这里先模拟处理三种类型的Task，TaskType作为Task的属性；每个类型的Task对应一个Handler，分别有
ClickHandler, HoverHandler, PostHandler三类Handler 继承自Handler虚类；

``` java
public enum TaskType {
	CLICK,HOVER,POST
}
public class Task {
	public TaskType type;
	public Task(TaskType type){
		this.type = type;
	}
}

public class ClickHandler extends Handler{
	public ClickHandler(Handler next){
		this.next = next;
	}
	@Override
	public void handle(Task task) {
		if(task.type == TaskType.CLICK)
			System.out.println("click 已经完成");
		else
			super.next(task);
	}
}

public class HoverHandler extends Handler{
	public HoverHandler(Handler next){
		this.next = next;
	}
	@Override
	public void handle(Task task) {
		if(task.type == TaskType.HOVER)
			System.out.println("hover 事件完成");
		else
			super.next(task);
	}
}

public class PostHandler extends Handler{
	public PostHandler(Handler next){
		this.next = next;
	}
	@Override
	public void handle(Task task) {
		if(task.type == TaskType.POST)
			System.out.println("POST 已经完成相应");
		else
			super.next(task);
	}
}
```

测试用列中的chain为一个ClickHandler-->HoverHandler-->PostHandler-->null指向的链表；
``` java
public class Test {
	public static void main(String[] args) {
		Handler chain = new ClickHandler(new HoverHandler(new PostHandler(null)));
		Task task0 = new Task(TaskType.CLICK);
		Task task1 = new Task(TaskType.POST);
		chain.handle(task0);
		chain.handle(task1);
	}
}
```
运行结果:
``` bash
	 click 已经完成
	 POST 已经完成
```
### 用处及不足：
标准的责任链接实际很少会用到，多是责任链的每个Handler都处理完，然后next；像nodejs的web框架
express编写中间件(middleware),`app.use(mid)`,就将mid放入到app的stack([])属性里,每次调
用结束后或者throw exception都会next(),形成链式调用；

由上可以看出，每次有Task要处理的时候都需要遍历责任链找到相应的Handler，并且会new多个Handler
对象，在内存密集的程序会得不偿失，虽做到解耦松耦合的目的，但是性能会受到影响

***推荐阅读：***
[express的路由机制:https://cnodejs.org/topic/545720506537f4d52c414d87](https://cnodejs.org/topic/545720506537f4d52c414d87)
