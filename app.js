
const express = require('express');
const path = require('path');
const config = require('config-lite')(__dirname);
const logger = require('morgan');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const router = require('./routes/index');

// 生成一个 express 实例
const app = express();

// 指定网页渲染模板
app.set('views', path.join(__dirname, 'views')); // 设置 views 文件夹为存放视图文件的目录
app.set('view engine', 'ejs'); // 设置视图模板引擎 ejs

const logDirectory = path.join(__dirname, 'logs');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

function pad(num) {
    return (num > 9 ? "" : "0") + num;
}

// create a rotating write stream
const accessLogStream = rfs((time, index) => {
        if(! time)
            return "file.log";

        var month  = time.getFullYear() + "" + pad(time.getMonth() + 1);
        var day    = pad(time.getDate());
        var hour   = pad(time.getHours());
        var minute = pad(time.getMinutes());

        return month + "/" + month + day + "-" + hour + minute + "-" + index + "-file.log";
    }, {
        interval: '1d', // rotate daily
        path: logDirectory,
        initialRotation: true
});

// 自定义输出日志格式
logger.format('combined2', ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"');

app.use(logger('combined2', { stream: accessLogStream })); // 加载日志中间件-输出到文件
app.use(logger('dev')); // 加载日志中间件
app.use(express.json()); // 加载解析 json 的中间件
app.use(express.urlencoded({ extended: false })); // 加载解析urlencoded请求体的中间件
// app.use(cookieParser()); // 加载解析 cookie 的中间件 - 需另外安装
app.use(express.static(path.join(__dirname, 'public'))); // 设置public文件夹为存放静态文件的目录

// add router
router(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send({ message: 'error' });
    // res.render('error');
});

app.set('port', config.port);

module.exports = app
