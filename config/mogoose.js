"use strict";

const config = require('./config'),
    mongoose = require('mongoose'); //node 的 ODM模块,提供对象模型化,并且可以作为mongodb文档存储模块

module.exports = function() {
    var db = mongoose.connect(config.db);
    var check_db = mongoose.connection;
    check_db.on('error', console.error.bind(console, 'db connection error:')); //db连接失败回调
    check_db.once('connected', function() {     //db连接成功回调
        console.log("db connect success!");
    });
    check_db.on('disconnected', function () {
        console.log("db connection disconnected!"); //db连接断开回调
    });

    require('../app/models/user.server.model');
    return db;
}