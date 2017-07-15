---
title: mongo 备忘
date: 2017-02-05 20:23:56
tags: ['mongo', '备忘']
---
## 备份数据
- mongodump
``` bash
mongodump --host mongodb1.example.net --port 37017 --db dbname --collection collectioname --username user --password pass --out /opt/backup/mongodump
```
- mongostore
``` bash
mongorestore --host hostname --port 27017 --db anfuscan --collection news --username sfish --password sfishpassmongo netBrain 
```
