---
title: junit的使用
date: 2017-10-13 18:40:54
tags: ['junit', '工具']
---
## junit的引入
通过`IntelliJ IDEA`创建`maven`项目；引入`pom`依赖；
``` xml
<dependencies>
        <!-- https://mvnrepository.com/artifact/junit/junit -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
```
**注意点：**

一定要将测试文件放在一起，比如`test`文件夹下，并且通过ide将该目录标识为`Test Sources Root`,不然在其他`java`目录建的测试代码不能引入`junit`,其只能在`Test Sources Root`里才能使用。
