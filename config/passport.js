"use strict";

var Passport = require('passport'),
    Mongoose = require('mongoose');

module.exports = function () {
    var User = Mongoose.model('User');  //使用User模型
    
    Passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    Passport.deserializeUser(function (id, done) {  
        User.findOne({
           _id:id
        }, '-password -salt', function (err, user) {
            done(err, user);
        })
    });

    require('./strategies/local.js')();   //加载本地策略配置
};