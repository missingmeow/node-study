# node-study
Just for learning node.js.

主要是学习 Node.js 部分库的使用，以及如何构建自动化测试相关内容。

### 构建

> node version ≥ 8.12.0

```
cd node-study
npm install
npm start
```

部分相关库可能使用全局安装更方便使用，下面如果遇到会补充：
```
```

### 工程结构

app.js：        启动文件，或者说入口文件
package.json：  存储着工程的信息及模块依赖，当在 dependencies 中添加依赖的模块时，运行npm install，npm 会检查当前目录下的 package.json，并自动安装所有指定的模块
node_modules：  存放 package.json 中安装的模块，当你在 package.json 添加依赖的模块并安装后，存放在这个文件夹下
public：        存放 image、css、js 等文件
routes：        存放路由文件
views：         存放视图文件或者说模版文件
bin：           存放可执行文件


### 学习笔记

1. [配置文件模块工具 config-lite](https://github.com/sondragon/node-study/blob/master/notes/%E9%85%8D%E7%BD%AE%E5%B7%A5%E5%85%B7config-lite.md)
2. [日志中间件 morgan](https://github.com/expressjs/morgan)
3. [日志文件每日新建一份存储 rotating-file-stream](https://github.com/iccicci/rotating-file-stream)
