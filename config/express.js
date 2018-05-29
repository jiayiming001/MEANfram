'use strict';
const express = require("express"),
    morgan = require('morgan'), //提供简单日志中间件
    compress = require('compression'), //提供响应式内容的压缩功能
    bodyParser = require('body-parser'), //提供几个处理请求数据的中间件
    methodOverride = require('method-override'), //提供了对HTTP DELETE和PUT的方法
    path = require('path'),         //提供文件目录拼接
    session = require('express-session'), //Simple cookie-based session middleware
    redisStore = require('connect-redis')(session); //redis内存数据库存放session功能

const config = require('./config'); //加载一些配置,比如session的secret

module.exports = function() {
    var app = express();


    if(process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));       //开发环境下启用简单日志功能
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());          //生产环境下启动响应式内容的压缩功能
    }
    app.use(bodyParser.urlencoded({ extended: true }));//作用是获得req.body中的字符串，然后转成对象赋值给req.body
    app.use(bodyParser.json()); //提供req中的json数据的解析,解析结果放在req.body中
    app.use(methodOverride()); //添加DELETE和PUT两个http请求方式

    app.set('views', path.join(__dirname , '../app/views')); //设置视图文件的存储目录
    app.set('view engine', 'jade');    //设置EJS为express应用的模板引擎


    app.use(session({
        name: 'mytest',
        secret: config.sessionSecret,
        rolling: true,
        resave: true,
        saveUninitialized: false,
        cookie: { 
            maxAge: config.minute
        },
        store: new redisStore({
            host: '127.0.0.1',
            port: '6379',
            db: 0,
            pass: '',
        })
    }));//设置session配置

    //检查静态路由配置成功,访问http://localhost:3000/views/deaom.html
    app.use(express.static(path.join(__dirname, '../pubilc'))); //配置静态文件路径

    require('../app/routes/index.server.routes')(app); //使用路由文件中的函数为app添加路由
    return app;
}