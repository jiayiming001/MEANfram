'use strict';
//如果没有设置环境变量NODE_ENV,默认值为development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';  

const express = require('./config/express'),  //导入express应用初始化文件(函数)
    Mongoose = require('./config/mogoose'),  //导入monogoose初始化文件(函数)
    Passport = require('./config/passport'); //不仅支持本地用户的身份验证,还支持OAuth的验证登录,比如:Facebook, Twitter和Google

const db = Mongoose();
const app = express(app); //express会将会话信息持久化存储到mongodb中
const passport = Passport();


app.listen(3000);
console.log('Server running at http://127.0.0.1:3000');

module.exports = app;