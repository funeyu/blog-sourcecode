---
title: mac安装ipython权限不足
date: 2016-11-05 14:18:03
tags: ['python', '安装']
---
## 安装ipython的时候
运行命令如下
``` bash
pip install ipython
```
或者  
``` bash
sudo pip install ipython
```
都会报错：
![](/img/posts/ipython_install_error.png)

## 解决方案
- 重新安装python
  > brew reinstall python
- 运行命令
  > pip install ipython

bingo~~~
