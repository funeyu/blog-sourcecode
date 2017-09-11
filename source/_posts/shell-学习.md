---
title: shell 学习
date: 2017-09-11 22:11:08
tags: ['shell']
---
## 权限
``` bash
chmod +x file.sh
```
使得`file.sh`可执行

当然也可以将该可执行的权限收回：
``` bash
chmod -x file.sh
```

`sudo -iu test`切换到普通用户；

## 传参
shell 传参数，以`$1, $2, $3`的形式输出所有的参数 `$0`为执行文件名

``` bash
// tesh.sh
echo "shell 传参：";
echo "第一个参数为：$1";
echo "第二个参数为：$2";
```
执行：
``` bash
sh test.sh 1 2
```
输出：
``` bash
shell 传参：
第一个参数为：1
第二个参数为：2
```
如果是变数量的参数：
可以使用`shift`操作；每次`shift`操作使得参数列表前移一个，即抛弃第一个，第二个成为第一个参数，`$#`减一，`$1`为之前没`shift`的`$2`;
和js里数组的`shift`操作很类似，每次shift一个数组，数组长度减一，同时前移一位；
``` bash
count=1;
while [ $# != 0 ]; do
  echo "第$count 个参数为：$1";
  let count=count+1;
  shift
done
```
执行结果：
``` bash
第1个参数为： hello
第2个参数为： jack
```
