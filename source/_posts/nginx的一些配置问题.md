---
title: nginx的一些配置问题
date: 2016-07-30 19:29:43
tags: ['nginx', '配置']
---
## mac下安装
直接 `brew install nginx`，安装路径在`usr/local/Cellar/nginx/`目录下，nginx.conf在`/usr/local/etc/nginx`目录下；
## nginx 发布静态页面
通过改变nginx.conf的配置文件来配置页面根目录；如
``` bash
server {
  listen 8080 default_server;

  root /usr/local/www/node_test;
  index index.html index.htm;
  location /static/ {
    try_files $uri $uri/ =404;
  }
}
```
<!--more-->
该配置就是配置了一个静态服务器，node_test为静态服务器的目录名称，index 设置项为打开该server下默认进入的html文件，而/static/的配置项  
为访问静态文件目录，如css jpg js等文件一般都要放在该目录下；
## nginx 发布动态页面
在这里我们要通过nginx的反向代理去将访问代理的动态请求；如下图所示：
![](/img/posts/proxy_nginx.png)
我们可以通过设置`proxy_pass http://xxxx.xxx`来配置要穿透的动态请求；如
``` bash
server {
      listen       8080;
      server_name  localhost;

      root /usr/local/www/node_test;
      index index.html index.htm;
      location /static/ {
          try_files $uri $uri/ =404;
      }
      location /api/ {
          proxy_pass http://localhost:2000;
      }
    }
```
在本地同时启着一个node服务
``` javascript
var express = require('express');
var app = express();

app.get('/api/cat/:name', function(req, res){
  res.json({
    name: req.params.name
  })
});

app.listen(2000);
```
这样子就使得凡是以/api/开头的请求都被代理到`localhost:2000`上，当你访问`localhost:8080/api/cat/java`，客户端会返回
![](/img/posts/proxy_dynamtic.png)

## server的配置
server模块是nginx用来配置处理相对应请求的虚拟server，每当请求来时，都会有相应的server块处理；就这样Nginx可以使得服务器有不同的server实例，可以构建不同的服务
首先Nginx首先根据`listen`去匹配请求对应的server块
🌰
> "host1.example.com"，第二个server会被选中
``` bash
server {
  listen 80;
  server_name *.example.com;
}
server {
  listen 80;
  server_name host1.example.com;
}
```

> 在这个例子中，“www.example.org”,第二个server会被选中
``` bash
server {
  listen 80;
  server_name www.example.*;
}

server {
  listen 80;
  server_name *.example.org;
}

server {
  listen 80;
  server_name *.org;
}
```

> 第三个例子中，"www.example.com"第三个server块将会被选中
``` bash
server {
  listen 80;
  server_name host1.example.com;
}

server {
  listen 80;
  server_name example.com;
}

server {
  listen 80;
  server_name www.example.*;
}
```
## location的配置
- 详细的规则：
  + Directives with the = prefix that match the query exactly. If found, searching stops.
  + All remaining directives with conventional strings, longest match first. If this match used the ^~prefix, searching stops.
  + Regular expressions,in order of definition in the configuration file.
  + If #3 yielded a match, that result is used.Else the match from #2 is used.
例如
``` bash
location = / {
  # 只匹配“/”
}
location / {
  # 匹配任何请求，因为所有请求都是以"/"开始
  # 并且优先匹配长字符
}
location ^~ /images/ {
  #匹配任何以 /images/ 开始的请求，并停止匹配其他location
}
location ~* .(gif|jpg|jpeg)$ {
  # 匹配以 gif，jpg， jpeg结尾的请求
}
```
> 参考文献 [https://www.digitalocean.com/community/tutorials/understanding-nginx-server-and-location-block-selection-algorithms](https://www.digitalocean.com/community/tutorials/understanding-nginx-server-and-location-block-selection-algorithms)


## rewrite的配置
rewrite与location都能实现跳转，但是rewrite是在同一域名内更改获取资源的路径，但是location是可以代理到其他的服务器，反向代理的作用；  
rewrite的书写规则为`rewrite regex replacement [flag]`,这flag可以为`last`,`break`,`redirect`(302), `permanent`(301);
### if指令
语法为`if(condition) {...}`,给定的condition进行判断
1. 直接比较变量和内容时，使用`=`或`!=`
2. `~`为区分大小写的正则匹配，`~*`不区分大小写的正则匹配
3. `-f`和`!-f`用来判断是否存在文件
4. `-d`和`!-d`用来判断是否存在目录
5. `-e`和`!-e`用来判断是否存在文件或者目录
6. `-x`和`!-x`用来判断文件是否可执行  

如下例子
``` bash
// 如果query string 中包含"post=140",永久重定向到example.com
if($args ~ post=140){
  rewrite ^ http://example.com/ permanent;
}
// 防盗链
location ~* \.(gif|jpg|png|swf|flv)$ {
  valid_referers none blocked www.XXX.com;
  if($invalid_referer) {
    return 404;
  }
}
```
