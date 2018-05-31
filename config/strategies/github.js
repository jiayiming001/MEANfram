"use strict";
var Passport = require('passport'),
url = require('url'),
GithubStrategy = require('passport-github').Strategy,  //github的身份验证策略
config = require('../config'),
users = require('../../app/controllers/users.server.controller');   //user的控制器

module.exports = function () {
    Passport.use(new GithubStrategy({     //facebook的构造函数,需要facebook应用信息对象和回调函数
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callbackURL,
        passReqToCallback: true 
    },
    //回调函数有http请求对象 验证请求对象  获取新访问令牌的对象  用户资料对象 用户授权完后的回调函数
    function (req, accessToken, refreshToken, profile, done) { 
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;
        // console.log(profile);
        var providerUserProfile = {
            firstName: profile.displayName,
            lastName: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'github',
            providerId: profile.id,
            providerData: providerData
        };


        users.saveOAuthUserProfile(req, providerUserProfile, done);
     }));
};