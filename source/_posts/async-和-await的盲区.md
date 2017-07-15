---
title: async 和 await的盲区
date: 2017-07-14 00:04:22
tags: ['javascript', 'es6']
---
> 先看一段代码，该代码自己天真以为`a`就是`promise`后的结果，其实不是这样子的

``` javascript
var asy = async function() {
  let a = await new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('here')
    }, 1000)
  })

  console.log(a + 'is')
  // var b = a + 'b'
  // return b
  return a
}

console.log(asy())

```
<!--more-->

打印的内容为：这里的直接返回`a`其实就是一个`promise`,不是直接`.then`后的结果，但是在`async`函数里操作该`promise`的时候就是与`.then`的结果操作；直接返回`a`或者`a + 'b'`等都是返回的promise
``` bash
Promise { <pending> }
hereis
```


### 错误处理的注意点

一般的promise的错误处理方式都是通过`.catch()`的方式去捕捉错误，如下所示：
``` javascript
const makeRequest = () => {
  try {
    getJSON()
      .then(result => {
        // this parse may fail
        const data = JSON.parse(result)
        console.log(data)
      })
      .catch((err) => {
        console.log(err)
      })
  } catch (err) {
    console.log(err)
  }
}
```
通过`async/await`改写可以简化代码：
``` javascript
const makeRequest = async() => {
  try {
    let data = JSON.parse(await getJSON())
    console.log(data)
  } catch {
    console.log(err)
  }
}
```

还有一个很值得注意的地方：

``` javascript
async function rejectionWithReturnAwait () {
  try {
    return await Promise.reject(new Error())
  } catch (e) {
    return 'Saved!'
  }
}

async function rejectionWithReturn () {
  try {
    return Promise.reject(new Error())
  } catch (e) {
    return 'Saved!'
  }
}
```

第一个async函数,等待一个rejected状态的promise，并且被捕捉到，成功返回saved的状态的一个新的promise（await 会重新返回一个promise）；

第二个直接返回一个rejected的Promise，直接返回就是一个未被捕捉异常的promise

``` javascript
rejectionWithReturnAwait()
Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: "Saved!"}
rejectionWithReturn()
Promise {[[PromiseStatus]]: "rejected", [[PromiseValue]]: Error
    at rejectionWithReturn (<anonymous>:11:27)
    at <anonymous>:1:1}
```
