---
title: nio 知识点
date: 2018-04-07 20:29:50
tags: ['java', 'nio']
---

## selector.selecte空转：

当client端主动断开链接，server端会收到一个读事件，会造成如下代码一直循环：
```java
protected void process(Selector selector) throws IOException {
        Set<SelectionKey> selectedKeys = selector.selectedKeys();
        if(selectedKeys.isEmpty()) {
            return ;
        }
        System.out.println("process");
        for(Iterator<SelectionKey> i = selectedKeys.iterator(); i.hasNext();) {
            SelectionKey k = i.next();
            i.remove();

            if(!k.isValid()) {
                return ;
            }
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("process worker");
            try {
                int readyOps = k.readyOps();
                if((readyOps & SelectionKey.OP_READ) != 0 || readyOps == 0) {
                    if(!read(k)) {
                        continue;
                    }
                }
                if((readyOps & SelectionKey.OP_WRITE) != 0) {

                }
            } catch (CancelledKeyException e) {
                close(k);
            }
        }
    }
    
    protected boolean read(SelectionKey k) {
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            if(k.isReadable()) {
                System.out.println("readddd");
    
                SocketChannel sc = (SocketChannel) k.channel();
                int count;
                try {
                    while((count = sc.read(buffer)) > 0) {
    
                    }
    
                    //if(count < 0) { // 这里是客户端主动关闭channel
                    //    sc.close();
                    //}
                } catch (IOException e) {
    
                }
                return true;
            }
    
            System.out.println("reeeeddd false");
            return false;
    
        }
```

解决方法就是上面的注释掉的代码，监测count，要是有<0,就是代表client主动关闭了channel，server端就要主动地关闭channel;
否则会一直循环；
