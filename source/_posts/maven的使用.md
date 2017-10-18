---
title: maven的使用
date: 2017-07-17 21:40:09
tags: ['maven', '备忘']
---
![](/img/posts/maven_logo.svg)
## 快速搭建项目
``` bash
mvn archetype:generate -DgroupId=com.funer -DartifactId=springmvcDemo -DpackageName=com.funer.springmvcDemo -DarchetypeArtifactId=maven-archetype-webapp
```
> `-DgrounpId`:项目或组织的唯一标识
> `-DartifactId`: 项目的通用名称
> `DpackageName`: 项目的包名
> `DarchetypeArtifactId`: 模板名称， maven-archetype-webapp就是指标准的maven web项目

## Archetype
使用Archetype生成项目骨架，运行:
``` bash
mvn archetype:generate
```
生成一个带有`main`和`test`两个文件夹的`src`，同时有`junit`依赖的`pom.xml`依赖文件

## pom.xml
+ pom.xml的文件：
``` xml
<dependency>
  <groupId>junit</groupId>
  <artifactId>junit</artifactId> <version>4.7</version>
  <scope>test</scope>
</dependency>
```
`scope=test`，定义了依赖的使用范围，依赖为`test`的时候，该依赖才会被加入到代码的`classpath`中，在项目主代码是没有任何作用的。

+ 来自同一项目的不同模块，如：
`org.springframework:spring-core:2.5.6` 、 `org.springframework:spring-beans:2.5.6` 、 `org.springframework:spring-context:2.5.6` 和 `org.springframework:spring-context- support:2.5.6`,由于来自同一项目，这些版本是相同的。可以通过如下修改：
  ``` xml
  <properties>
    <springframework.version>2.5.6</springframework.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-core</artifactId>
      <version>${springframework.version}</version>
    </dependency>

    <dependency>
      <groupId>org.springframework</groupId>
        <artifactId>spring-beans</artifactId>
        <version>${springframework.version}</version>
    </dependency>

    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>${springframework.version}</version>
    </dependency>

    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context-support</artifactId>
      <version>${springframework.version}</version>
    </dependency>
  </dependencies>
  ```
