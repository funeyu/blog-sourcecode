---
title: 介绍loadable-components翻译
date: 2017-09-18 22:07:48
tags: ['code split', '翻译']
---
[Introducing loadable-components](https://medium.com/smooth-code/introducing-loadable-components-%EF%B8%8F-646dd3ab0aa6)
![](/img/posts/loadableComponents.png)

## 介绍

如果熟悉**React**的生态(Babel，Webpack，ES6...)，应该就会听过**code split**。Code split是说将你的代码分割成一个个的“块”，减少用户加载js bundle的大小。减小每个要加载的代码块可以使得加载运行都更快、Amazon 公司曾有句：“一秒就有16亿$的代价”。网页的性能是一项指标，不是一个漏洞需要修复，你要尽可能的使得其更快。
<!--more-->
## Webpack

Webpack 支持按需加载已经有些时候了，且Webpack2 引入**动态引入**。最佳实践是使用`import()`做代码切分。

一个基本的代码切分的例子(main.js)：

``` javascript
// 'a'将存在于主代码块中
import a from 'a'

// 'b' 将在其他的代码块加载
import('b').then(b => {
  console.log(`hello ${a} ${b}`)
})
```

执行`webpack main.js outjs.js`将产生两个文件:`output.js`包含`main.js`和`a.js`,另一个是`output.0.js`包含`b.js`;


## React
大多数时候都是利用`react-router`库来管理React的应用。并且**最好的方式也是通过路由的方式做代码的切分**

react-router 4的范例如下：
``` javascript
import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import Home from './Home'
import About from './About'
import Topics from './Topics'

const App = ()=>
  <BrowserRouter>
    <div>
      <ul>
        <li><Link to="/">Home</li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </BrowserRouter>

  export default App
```
此例中，`Home`,`About`,`Topics`组件同步加载，也就是说：**Webpack不会将其放在不同的的代码块里**；这里可以使用`import()`实现异步的特性.

为实现异步性，需在挂在的时候就去包装下组件；
``` javascript
import React from 'react'

class Home extends React.Component {
  state = {Component: null}

  componentWillMount() {
    import('./Home').then(Component => {
      this.setState({Component})
    })
  }

  render() {
    const {Component} = this.state
    return Component ? <Component {...props} /> null
  }
}
```

这样webpack打包就可以将可以做到代码切分了；但是上面的代码在每次加载组件的时候都要重复地写，可以用**loadable-components**帮你处理，`loadable()`方法包装组件成一个异步特性的组件；
``` javascript
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import loadable from 'loadable-components'

const Home = loadable(() => import('./Home'))
const About = loadable(() => import('./About'))
const Topics = loadable(() => import('./Topics'))

const App = () =>
  <BrowserRouter>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </BrowserRouter>

ReactDOM.render(<App />, document.getElementById('main'))
```

## 服务器渲染
服务端，你没有Webpack可以使用。node不支持动态加载。此时你有两个选择：
+ [Building your code with Webpack targetting node](https://webpack.js.org/configuration/target/#components/sidebar/sidebar.jsx)
+ [Transpiling it using babel-plugin-dynamic-import-node](https://github.com/airbnb/babel-plugin-dynamic-import-node)

不管你选择哪个，道理都是相同的，都是使得`import()`在Node.js坏境里有效


#### 应用在Server端渲染
第一个面临的问题是渲染你的应用。Server端React同步渲染应用，你不能异步加载组件。
