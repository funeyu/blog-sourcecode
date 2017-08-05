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
