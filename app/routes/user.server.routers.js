"use strict";
const users = require("../controllers/users.server.controller"),
    Passport = require('passport');


module.exports = function(app) {
    app.route('/users')
        .post(users.create) 
        .get(users.list);

    app.route("/users/:userId")  //read()方法所在路由中有userId参数
        .get(users.read)
        .put(users.update)
        .delete(users.delete);
    
    app.route("/user/:username")
        .get(users.read);

    app.route('/signup')
        .get(users.renderSignup)
        .post(users.signup);


    app.route('/signin')
        .get(users.renderSigin)
        .post(Passport.authenticate('local', {      //使用本地策略
            successRedirect: '/',                   //告知passport身份验证成功后跳转的地址
            failureRedirect: '/signin',             //告知passport身份验证失败后跳转的地址
            failureFlash: true                      //告知passport是否使用flash消息
        }));

    app.route('/signout')
        .get(users.signout);

    
    app.get('/oauth/facebook', Passport.authenticate('facebook', {
        failureRedirect: '/signin'
    }));

    app.get('/oauth/facebook/callback', Passport.authenticate('facebook', {
        failureRedirect: '/signin',
        successRedirect: '/'
    }))

    app.param('userId', users.userByID);  //当请求的路由中有userId参数的时候调用,生产req.user对象,在read()之前执行
    app.param("username", users.userGetByUsername); //当请求的路由中有username参数的时候调用,生成req.user对象
}