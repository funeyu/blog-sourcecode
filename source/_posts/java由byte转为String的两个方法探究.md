---
title: java由byte转为String的两个方法探究
date: 2016-07-24 12:26:15
tags: ['java', 'String']
---

> 今天在看一个开源的java序列框架 VSerializer，里面有个方法是由byte[]转换成String的方法，代码地址：[https://github.com/vaslabs/VSerializer/blob/master/lib/src/main/java/org/vaslabs/vserializer/AlphabeticalSerializer.java#L552](https://github.com/vaslabs/VSerializer/blob/master/lib/src/main/java/org/vaslabs/vserializer/AlphabeticalSerializer.java#L552)<!--more-->
作者的方法为：
``` java
private char[] toChars(byte[] bytes) {
    ByteBuffer byteBuffer = ByteBuffer.wrap(bytes);
    char[] chars = new char[bytes.length / 2];
    for (int i = 0; i < chars.length; i++) {
        chars[i] = byteBuffer.getChar();
    }
    return chars;
}
```

一般的我们会直接将byte数组通过`new String(byte[] bytes)`直接转化；
由于好奇这样做真的性能会好些吗？自己就做了相应的对比；
``` java
String str = "javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，"
        + "javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，"
        + "javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，"
        + "javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，javaand类型对比速度大小试试就知道了吧，";
byte[] strBytes = str.getBytes();

long start1 = System.nanoTime();
String newS = new String(strBytes);
System.out.println(System.nanoTime() - start1);

long start = System.nanoTime();
int length = strBytes.length / 2;
ByteBuffer bytes = ByteBuffer.wrap(strBytes);
char[] chars = new char[length];
for(int i = 0; i < length; i ++) {
    chars[i] = bytes.getChar();
}
String results = new String(chars);
System.out.println(System.nanoTime() - start);
```

对比下来，后者是前者时间的4~5倍之间，直接new String(byte[] bytes)反而是比较快速的；

## 为什么会这样子？
通过打印不同过程的时间， 发现后者在`bytes.getChar()`耗时较多，具体的原因待发现，总之可以看出来，能直接用jdk的方法实现的，最好直接用，jdk的方法是经得起各个方面的考验的，所以没必要去自己实现同样功能的方法，除非是自己真的功力达到那个地步~~~~
