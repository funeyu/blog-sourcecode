---
title: redux 源码解读
date: 2017-07-23 01:05:44
tags: ['react', 'redux', '源码']
---
![](/img/posts/redux.jpg)

## redux的基本用法：

action：一是含有type参数的js对象，一般由`store.dispatch(action)`调用，该对象是描述`store`要变化的一些数据来源，例如：
``` javascript
function setVar(key, value) {
  return {
    type: 'SET_VAR',
    key,
    value
  }
}
```
`dispatch`调用的方式为`store.dispatch(setVar('hello', 'java'))`
<!--more-->
reducer: 这是store真正改变的函数，返回一个新的state对象,可以用一些`assign(), concat(), splice()`函数，或者用immutableJS方式生成新的对象
``` javascript
function setVar(state = {}, action) {
  switch (action.type) {
    case 'SET_VAR':
      state[action.key] = action.value
      return Object.assign({}, state)
    default:
      return state
  }
}
```
当然不同的reducer可以通过`combineReducers()`去合并多个散列的`reducers`,
``` javascript
import { combineReducers } from 'redux'
import todos from './todos'
import counter from './counter'

export default combineReducers({
  todos,
  counter
})
```

store: 通过`createStore(reducers)`去生成单一的appData集；其有公共的方法：
+ `getState()`获取state值
+ `dispatch()`改变state的值
+ `subscribe(listener)`注册监听函数

applyMiddleware(...middlewares)：`middleware(arguments)`有两个参数，`Store`'`dispatch`和`getState`
用法：
``` javascript
function logger({getState}) {
  return next => action => {
    console.log('will dispatch', action)

    // Call the next dispatch method in the middleware chain
    let returnValue = next(action)
    console.log('state after dispatch', getState())

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue
  }
}

let store = createStore(
  todos,
  ['Use Redux'],
  applyMiddleware(logger)
)
```

bindActionCreators: 将返回为`action`的函数转变成`key`为该函数名，`value`为将将`dispatch`包含在`action`的函数
参数：`actionCreators`和`dispatch`,返回一个和`action`相似的对象，只是每个`action`对象都会直接调用`store.dispatch(action)`

## redux 的源码结构
![](/img/posts/redux_source_src.png)

### createStore的源码
``` javascript
export default function createStore(reducer, preloadedState, enhancer) {
  // 这里是applyMiddleware用到的enhancer加强版的createStore，后面会介绍到
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    return enhancer(createStore)(reducer, preloadedState)
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.')
  }

  let currentReducer = reducer       //经过combineReducers combine后的一个reducer
  let currentState = preloadedState  //每个store会持有一个state,即store的数据集，store.getState()就返回该对象
  let currentListeners = []          //每次dispatch 都会调用的监听
  let nextListeners = currentListeners
  let isDispatching = false          //是否在store.dispatch操作的标志位

  function ensureCanMutateNextListeners() { //将本次的currentListeners作为一次复制给nextListeners，作为nextListeners的快照
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }
  /*
  这个函数是添加订阅的入口，每次添加listener都是在nextListeners上操作，而不是直接在currentListeners上操作，而每次dispatch都是在currentListeners上操作
  store.subscribe(listener1)
  store.subscribe(listener2)
  store.dispatch(action) // 该action可能是异步的过程,即使是异步的过程，也只是监听上面的(listener1, listener2), 因为每次store.dispatch都是传入的(listener1, listener2)的快照

  store.subscribe(listener3)

  store.dispatch(action1) //该action1就可以调用(listener1, listener2, listener3)

  注意点：每次subcribe后都形成一个闭包,要注意设置变量=null
  */
  function subscribe(listener) {
    let isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }

  function dispatch(action) {

    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    const listeners = currentListeners = nextListeners
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    return action
}
}
```

### combineReducers的源码：
``` javascript
/*

将多个reducer拼成一个reducer返回，在返回reducer前做的一些事情：
  将reducers  循环以reducer的函数名做为finalReducers的key，返回新state的函数作为finalReducers该key的value,复制一份形成闭包
返回新的reducer函数combination:
  有默认的总state对象，和一个新的state对象： nextState,遍历finalReducers，调用action函数，返回新的局部state都置于nextState中，以该reducer的函数名作为key，生成的局部state作为value存储，且判断每次生成的局部state和之前总state对象里的该key的局部state对比，若有变化就返回新的nextState

然后每次调用dispatch(action)方法的时候，依次调用每个子reducer的方法，由于一般reducer方法都写成
switch (action.type) {
  case 'ADD_TODO':
    return state.concat([action.text])
  default:
    return state
}

如果不是该action，就直接返回原state,只有真是要执行的action时，才去执行返回一个新的state,

todo: 这里实际上又优化的空间，不要循环遍历，应该做成对象的存储方式（hash）,这样可以一次就能找到要执行的action并且声称相应的state，不知道作者为啥要去这种列表的方式，自己有可能想简单了？？？？？
*/
export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)

  return function combination(state = {}, action) {
    let hasChanged = false
    const nextState = {}
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    return hasChanged ? nextState : state
  }
}
```



## 总结

最基本的源码就这些，写法还是挺精致的，回到文中一开始的那张图，结合一段代码来看

``` javascript
const store = createStore(counter)
const rootEl = document.getElementById('root')

const render = () => ReactDOM.render(
  <Counter
    value={store.getState()}
    onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
    onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
  />,
  rootEl
)

render()
store.subscribe(render)
```

该页面就是一个创建了`store`作为`state`的数据集,在每次用户交互的时候，通过`store.dispatch(action)`来改变store值，同时添加监听函数`store.subscribe(render)`即每次`dispatch`的时候都会调用该`render`;这样一来，形成了单一数据流，数据变化就引起界面的变化。
