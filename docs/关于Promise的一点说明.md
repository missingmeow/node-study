# 关于 Promise 的一点说明

## Promise 链

这里主要是介绍一下链式调用的问题。

假设有多个网络操作，必须是按顺序执行，那么中间如何处理可以保证一直可以链式执行呢？

如果对 `Promise` 不熟悉，很有可能是会写成跟异步回调一样，整个回调地狱出来。

```js
async function aaa(str) {
  // 如果这里抛异常
  // throw 'eaa';
  return str + 'aaa';
}

async function bbb(str) {
  // 如果这里抛异常
  // throw str + 'ebb';
  return str + 'bbb';
}

// 普通函数
function ccc(str, callback) {
  setTimeout(() => {
    // 如果这里抛异常
    // callback(str + 'ecc');
    callback(null, str + 'ccc');
  }, 1000)
}
```

我们知道，`aaa()`、`bbb()` 返回的是一个 `Promise` 对象。如果我们把 `aaa().then()` 的返回结果输出来看，其实它也是一个 `Promise` 对象。既然如此，那么这个`then`返回的`Promise`，它的状态是由谁决定的呢，究竟是 `fullfilled` 还是 `rejected`？

这里，我们通过测试可以知道：

```js
// 下面说的 Promise 状态指的是 then 返回的 Promise 对象
function test() {
  aaa('1').then(value => {
    // 1. 如果这里抛出了异常，那么 Promise 的状态为 rejected
    throw 'err';
    // 2. 如果返回的是非 Promise 对象，那么 Promise 的状态为 fullfilled
    return value;
    // 3. 如果返回的是 Promise 对象，那么 Promise 的状态就由返回的对象决定
    return new Promise((resolve, reject) => {
      reject('err2');
    })
  }).catch(err => {
    console.log(err);
  })
}
```

那么以上，如果想要通过 then 链式调用多个异步函数，可以像这样：

```js
function test() {
  aaa('1').then(vala => {
    console.log(vala);
    return bbb(vala);
  }).then(valb => {
    console.log(valb);
    return new Promise((resolve, reject) => {
      ccc(valb, (err, value) => {
        if (err) reject(err);
        else resolve(value);
      })
    });
  }).then(valc => {
    console.log(valc)
  }).catch(err => {
    console.error(err);
  })
}
```

运行上面代码输出的结果是：

```
1aaa
1aaabbb
1aaabbbccc
```

如果调用 `ccc()` 的时候没有封装使用 `Promise` 封装会怎么样呢？

```js

function test() {
  aaa('1').then(vala => {
    console.log(vala);
    return bbb(vala);
  }).then(valb => {
    console.log(valb);
    return ccc(valb, (err, value) => {
      if (err) console.error(err);
      else console.log(value);
    })
  }).then(valc => {
    console.log(valc)
  }).catch(err => {
    console.error(err);
  })
}
```

最后的输出结果为：

```
1aaa
1aaabbb
undefined
1aaabbbccc
```

假设 `ccc()` 回调返回了错误的值：

```
1aaa
1aaabbb
undefined
1aaabbbecc
```

看出区别了吗？

## 中断 Promise 链

通过上面测试我们知道，不过链条中间返回成功或者失败，该链条上的 `then()` 方法会一直执行，直到执行完毕或者中间某个链条抛出了异常，那么，有没有可能中间某个链节点因为某种情况而需要终止该链条继续执行呢？

方法当然是有的，而且只有一个，就是返回的 `Promise` 只要保证它的状态一直都是 `pending` 即可。

代码如下：

```js
function test() {
  aaa('1').then(vala => {
    console.log(vala);
    return bbb(vala);
  }).then(valb => {
    console.log(valb);
    if (valb === 'aaabbb') {
      return new Promise(() => {}); // 这样就保证该 Promise 的状态为 Pending，后面的 then 不会再被执行
    }
    return new Promise((resolve, reject) => {
      ccc(valb, (err, value) => {
        if (err) reject(err);
        else resolve(value);
      })
    });
  }).then(valc => {
    console.log(valc)
  }).catch(err => {
    console.error(err);
  })
}
```
