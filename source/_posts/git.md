---
title: git备忘录
date: 2016-03-16 16:07:37
tags: ['git']
---

## 分支
1. 将本地分支推送到远端分支：
``` bash
git push <remote name> <branch name>
```

2. 基于某个分支创建分支：
*Note: 这里基于某个分支是指本地分支，是将本地分支commit后的内容复制到新的分支上；不是基于远端的分支*
``` bash
git checkout -b <new branch name> <branch name>

```
<!--more-->

3. 删除本地分支：
``` bash
git branch -d <name>
```

4. 删除远端分支：
``` bash
git push <remote name> :<branch name>
```
## 删除commit
``` bash
git reset --hard HEAD~1
```
当有3个commit:
```
commit 3
commit 2
commit 1
```
该方法会使HEAD is now at commit 2, 同时本地仓库的commit 3修改的代码也一起消失了；  
然后再使用 git push --force,这样可以使得最后一次的提交彻底消失；
> 该方法有很大危险，一定要做好代码备份之类的；


回滚代码为：
```
git log
git reset --hard <commit ID号>
```
可以将代码回滚到ID号处commit的代码;
