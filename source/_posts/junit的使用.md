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
<!--more-->
## junit的使用
1. `@Test`的使用：

  a:(expected=XXException.class)： 如果程序的异常和XXException.class一样，测试通过
  ``` java
  public class WorldTest {

    @Test(expected = MException.class)
    public void testSay() throws Exception {
        throw new HException("ja;fja;fj;a");
    }

    static class HException extends Exception {

        HException(String msg) {
            super(msg);
        }
    }

    static class MException extends Exception {
        MException(String msg) {
            super(msg);
        }
    }
}
  ```
  b:(timeout = 毫秒数)：如果程序运行时间小于该毫秒数，则测试通过
  ``` java
  @Test(timeout = 10)
  public void testHello(){
    // do something
  }
  ```
