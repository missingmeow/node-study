# node-study

[![Build Status](https://travis-ci.org/sondragon/node-study.svg?branch=master)](https://travis-ci.org/sondragon/node-study)
[![Node.js Version](https://img.shields.io/badge/node-%E2%89%A58.12.0-brightgreen.svg)](https://nodejs.org/en/download)

Just for learning node.js.

主要是学习 Node.js 部分库的使用，以及如何构建自动化测试相关内容。

### 构建

> node version ≥ 8.12.0

```
cd node-study
npm install
npm start
```

本工程使用了`eslint`代码规范模块，如果需要使用需要安装`eslint`模块：
```
npm install eslint -g
```

### 工程结构
```
app.js：        启动文件，或者说入口文件
package.json：  存储着工程的信息及模块依赖，当在 dependencies 中添加依赖的模块时，运行npm install，npm 会检查当前目录下的 package.json，并自动安装所有指定的模块
node_modules：  存放 package.json 中安装的模块，当你在 package.json 添加依赖的模块并安装后，存放在这个文件夹下
public：        存放 image、css、js 等文件
routes：        存放路由文件
views：         存放视图文件或者说模版文件
bin：           存放可执行文件
```

### 学习笔记

0. [express 教程多看API文档](https://expressjs.com/en/4x/api.html)

1. [配置文件模块工具 config-lite](https://github.com/sondragon/node-study/blob/master/notes/%E9%85%8D%E7%BD%AE%E5%B7%A5%E5%85%B7config-lite.md)

    1. [环境变量设置可跨平台应用解决windows与Linux不兼容问题 cross-env](https://github.com/kentcdodds/cross-env)

2. [日志中间件 morgan](https://github.com/expressjs/morgan)

    1. [日志文件每日新建一份存储 rotating-file-stream](https://github.com/iccicci/rotating-file-stream)

    关于`rotating-file-stream`有个需要注意的地方是，如果设置每日新建一个文件存储，它日志存储方式是先将新的日志会在默认的文件里，比如[这里](https://github.com/sondragon/node-study/blob/master/app.js#L28)的`file.log`中，到时间新建日志文件的时候它会把符合条件的日志全部拷贝进去，新日志仍然会放在`file.log`中。

    另外有个配置需要注意下：[initialRotation](https://github.com/iccicci/rotating-file-stream#initialrotation)

3. [自动化测试模块mocha](https://mochajs.org/)

    1. [should](https://github.com/shouldjs/should.js)
    2. [supertest](https://github.com/visionmedia/supertest)

4. [cookie-parser 模块](http://wiki.jikexueyuan.com/project/node-lessons/cookie-session.html)
    
    需要注意的一点就是，使用时可以指定一个类似密钥的字符串，如果不使用，则获取cookie是用`req.cookies`，如果使用了密钥，则获取cookie是要用`req.signedCookies`
