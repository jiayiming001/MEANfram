'use strict';
//如果没有设置环境变量NODE_ENV,默认值为development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';  

const express = require('./config/express');
const app = express();


app.listen(3000);
console.log('Server running at http://127.0.0.1:3000');

module.exports = app;