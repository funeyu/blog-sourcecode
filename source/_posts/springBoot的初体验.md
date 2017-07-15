---
title: springBoot的初体验
date: 2016-10-02 00:53:45
tags: ['java', 'web']
---
> 之前一直坚信java做web开发不如用python或者nodejs来的快速，敏捷；虽然自己喜欢写java代码，但是一直对用java开发web程序无感，不管是用国内人的[jfinal](http://www.jfinal.com/)还是用古老的框架ssh，感觉用着都没有其他的语言的框架顺手，如python的django、tornado、flask、javascript的nodejs，这些框架快速小巧很适合做web的搭建；相比来说就感觉java的框架一直沉重太多，做起web开发不是很轻快。但是最近在看springBoot框架，感觉用java开发web一点也不像之前了，在spring技术迭代中它已经改变很多了。
<!--more-->
## 一个REST服务
+ 代码目录结构如下图：
![](/img/posts/spring-boot.png)
先看pom文件吧，如下：
``` xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>net.javabeat</groupId>
    <artifactId>springboot-rest-demo</artifactId>
    <version>0.1</version>
    <name>Spring Boot REST API Demo</name>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.4.1.RELEASE</version>
    </parent>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
        </dependency>
    </dependencies>
</project>
```
### model目录
此目录存着数据model层，定义了数据的schema，如本例子中，定义mongodb 的book文档数据schema
``` java
package app.model;

import org.springframework.data.annotation.Id;
/**
 * Created by funeyu on 16/10/1.
 */
public class Book {

    @Id
    private String id;
    private String name;
    private String isbn;
    private String author;
    private int pages;

    public Book() {}

    public Book(String name, String isbn, String author, int pages) {
        this.name = name;
        this.isbn = isbn;
        this.author = author;
        this.pages = pages;
    }
    //...setter and getters...
}

```
### repository 目录
此目录为Spring Data Repository, 为了减少数据库操作的模板样例代码,只要定义个interface, 其余的crud实际实现都由springBoot去操作实现；
``` java
public interface BookRepository extends MongoRepository<Book, String> {}
```
### controller目录
该目录定义了路由对应的处理器，同时也定义了请求映射，为SpringBoot最主要的处理程序；
``` java
@RestController
@RequestMapping("/book")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @RequestMapping(method = RequestMethod.POST)
    public Map<String, Object> createBook(@RequestBody Map<String, Object> bookMap) {
        Book book = new Book(bookMap.get("name").toString(),
                bookMap.get("isbn").toString(),
                bookMap.get("author").toString(),
                Integer.parseInt(bookMap.get("pages").toString()));

        Map<String, Object> response = new LinkedHashMap<String, Object>();
        response.put("message", "Book created successfully");
        response.put("book", bookRepository.save(book));
        return response;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/{bookId}")
    public Book getBookDetails(@PathVariable("bookId") String bookId) {
        return bookRepository.findOne(bookId);
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/{bookId}")
    public Map<String, String> deleteBook(@PathVariable("bookId") String bookId) {
        bookRepository.delete(bookId);
        Map<String, String> response = new HashMap<String, String>();
        response.put("message", "book deleted succefully");

        return response;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/")
    public Map<String, Object> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        Map<String, Object> response = new LinkedHashMap<String, Object>();
        response.put("totalBooks", books.size());
        response.put("books", books);
        return response;
    }

}
```
> 这里没有引入json类库，接收body体的json数据时通过`Map<String, Object>`去获取json格式数据；@PathVariable("bookId")标记后面的参数为传来的bookId参数；
返回数据里也都是通过`new HashMap<>()`来作为json数据返回

## 回顾代码
上面的代码简简单单的几十行就实现了一个数据的增删改查的REST服务，可以说比nodejs之类的轻量级的web框架还要轻便些，比如在查询mongo的时候，尽然只要定义个interface就万事大吉，而不管是nodejs还是python都要吭哧吭哧地去对数据库CRUD,
而且上面代码真的是不能再精简了；spring引领变革，给java开发web带来一阵清风啊。
> 在这里记录个IntelliJ+IDEA编辑器的坑，在创建webapp的时候，要等会其才能创建好必要的文件夹（src， resources等），不然只会是一个空的项目目录，src等目录都没有创建~~~
