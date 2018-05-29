"use strict";
const users = require("../controllers/users.server.controller");
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

    
    app.param('userId', users.userByID);  //当请求的路由中有userId参数的时候调用,生产req.user对象,在read()之前执行
    app.param("username", users.userGetByUsername); //当请求的路由中有username参数的时候调用,生成req.user对象
}