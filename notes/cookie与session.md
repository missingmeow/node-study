### 无状态的http

我们都知道http的请求和响应式相互独立的，服务器无法识别两条http请求是否是同一个用户发送的。也就是说服务器端并没有记录通信状态的能力。我们通常使用cookie和session来确定会话双方的身份。

### cookie

cookie 是从服务器端发送的，服务器给不同的用户发送不同的标识，这个标识表示用户的身份，服务器通过客户端发送的这个标识来识别用户的身份，从而查询服务器中的该用户的相关数据，然后发送到该用户。

安装express提供的cookie-parser中间件：

> npm i cookie-parser

在我们使用的项目页面模块中引入 cookie-parser 插件，然后实例化它，如下：

```js
var cookieParser = require('cookie-parser');

var cp = cookieParser(secret, options);
```

它有两个参数，第一个参数secret，用它可以对cookie进行签名，也就是我们常说的cookie加密。它可以是字符串也可以是数组，如果熟悉加密原理的同学应该知道，这个字符串就是服务器所拥有的密文，第二个参数options包含如下可选参数：

```
path：指定 cookie 影响到的路径
expires: 指定时间格式
maxAge：指定 cookie 什么时候过期
secure：当 secure 值为 true 时，在 HTTPS 中才有效；反之，cookie 在 HTTP 中是有效。
httpOnly：浏览器不允许脚本操作 document.cookie 去更改 cookie。设置为true可以避免被 xss 攻击拿到 cookie
```

一个简单的例子：

```js
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();

// 使用 cookieParser 中间件;
app.use(cookieParser());

// 如果请求中的 cookie 存在 isFirst
// 否则，设置 cookie 字段 isFirst, 并设置过期时间为10秒
app.get('/', function(req, res) {
    if (req.cookies.isFirst) {
        res.send("再次欢迎访问");
        console.log(req.cookies)
    } else {
        res.cookie('isFirst', 1, { maxAge: 60 * 1000});
        res.send("欢迎第一次访问");
    }
});

app.listen(3030, function() {
    console.log('express start on: ' + 3030)
});
```

cookie-parser 还可以对Cookie数据进行加密，也就是我们所说的signedCookies。

### signedCookies

实现代码如下：

```js
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();

// 使用 cookieParser 中间件;
app.use(cookieParser('my_cookie_secret'));

// cookie
app.get('/', function(req, res) {
    if (req.signedCookies.isFirst) {
        res.send("欢迎再一次访问");
        console.log(req.signedCookies)
    } else {
        res.cookie('isFirst', 1, { maxAge: 60 * 1000, signed: true});
        res.send("欢迎第一次访问");
    }
});
```

从上面的代码中我们知道cooke-parser的第一个参数可以指定服务器端的提供的加密密匙，然后我们使用options中的signed配置项可实现加密。虽然这样相对安全，但是客户端的Cookie有局限性，在客户端发送请求时会增加请求头部的数据量，导致请求速度变慢；另外它不能实现数据的共享。

### session

express-session 是expressjs的一个中间件用来创建session。服务器端生成了一个sessionn-id，客户端使用了cookie保存了session-id这个加密的请求信息，而将用户请求的数据保存在服务器端，但是它也可以实现将用户的数据加密后保存在客户端。

session记录的是客户端与服务端之间的会话状态，该状态用来确定客户端的身份。

> express-session支持session存放位置

可以存放在cookie中，也可以存放在内存中，或者是redis、mongodb等第三方服务器中。

session默认存放在内存中，存放在cookie中安全性太低，存放在非redis数据库中查询速度太慢，一般项目开发中都是存放在redis中(缓存数据库)，[支持的数据库列表看这里](https://github.com/expressjs/session#compatible-session-stores)。

在express提供的express-session中间件安装命令：

> npm i express-session

在我们使用的项目页面模块中引入 express-session 插件，然后实例化它，如下：

```js
var session = require('express-session');

var se = session(options);
```

session()的参数options配置项主要有：

```
// 具体的字段说明还是需要到官方文档看，这里列出的并不全
name: 设置cookie中，保存session的字段名称，默认为connect.sid
store: session的存储方式，默认为存放在内存中
genid: 生成一个新的session_id时，默认为使用uid2这个npm包
rolling: 每个请求都重新设置一个cookie，默认为false
resave: 即使session没有被修改，也保存session值，默认为true
saveUninitialized：强制未初始化的session保存到数据库
secret: 通过设置的secret字符串，来计算hash值并放在cookie中，使产生的signedCookie防篡改
cookie : 设置存放sessionid的cookie的相关选项
```

看一个简单的demo：

```js
//app.js中添加如下代码(已有的不用添加)
var express = require('express');
var session = require('express-session');

app.use(session({
    secret: 'sessiontest',//与cookieParser中的一致
    resave: true,
    saveUninitialized:true
}));

//修改router/index.js,第一次请求时我们保存一条用户信息。
router.get('/', function(req, res, next) {
    var user={
        name:"Chen-xy",
        age:"22",
        address:"bj"
    }
  req.session.user=user;
  res.render('index', {
      title: 'the test for nodejs session' ,
      name:'sessiontest'
  });
});

//修改router/users.js，判断用户是否登陆。
router.get('/', function(req, res, next) {
    if(req.session.user){
        var user=req.session.user;
        var name=user.name;
        res.send('你好'+name+'，欢迎来到我的家园。');
    }else{
        res.send('你还没有登录，先登录下再试试！');
    }
});
```

以上文章出处[这里](https://segmentfault.com/a/1190000013048314)

### cookie和session区别

`cookie`：在网站中，http请求是无状态的。也就是说即使第一次和服务器连接后并且登录成功后，第二次请求服务器依然不能知道当前请求是哪个用户。cookie的出现就是为了解决这个问题，第一次登录后服务器返回一些数据（cookie）给浏览器，然后浏览器保存在本地，当该用户发送第二次请求的时候，就会自动的把上次请求存储的cookie数据自动的携带给服务器，服务器通过浏览器携带的数据就能判断当前用户是哪个了。cookie存储的数据量有限，不同的浏览器有不同的存储大小，但一般不超过4KB。因此使用cookie只能存储一些小量的数据。

`session`: session和cookie的作用有点类似，都是为了存储用户相关的信息。不同的是，cookie是存储在本地浏览器，而session存储在服务器。存储在服务器的数据会更加的安全，不容易被窃取。但存储在服务器也有一定的弊端，就是会占用服务器的资源，但现在服务器已经发展至今，一些session信息还是绰绰有余的。

`cookie和session结合使用`：web开发发展至今，cookie和session的使用已经出现了一些非常成熟的方案。在如今的市场或者企业里，一般有两种存储方式：

存储在服务端：通过cookie存储一个session_id，然后具体的数据则是保存在session中。如果用户已经登录，则服务器会在cookie中保存一个session_id，下次再次请求的时候，会把该session_id携带上来，服务器根据session_id在session库中获取用户的session数据。就能知道该用户到底是谁，以及之前保存的一些状态信息。这种专业术语叫做server side session。
将session数据加密，然后存储在cookie中。这种专业术语叫做client side session。flask采用的就是这种方式，但是也可以替换成其他形式。


[这部分文章出处](http://www.voidcn.com/article/p-octzcwpu-bpp.html)
