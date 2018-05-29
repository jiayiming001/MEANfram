"use strict";
const User = require('mongoose').model('User'); //返回在models中创建的User模型

exports.create = function(req, res, next) {   //根据req.body的json数据,创建一个user文档
    var user = new User(req.body); //创建一个文档,模型的实例
    user.save((err) => {  //保存文档,完成后回调
        if(err) {
            return next(err);
        } else {
            res.json(user);
        }
    }); 
};

exports.list = function (req, res, next) {  //查找所有的user文档
    User.find({}, (err, users) => {
        if (err) {
            return  next(err);
        }else {
            res.json(users);
        }
    });
};

exports.read = function (req, res) { //返回req.user对象的JSON作为返回响应
    res.json(req.user);
};


exports.userByID = function (req, res, next, id) {  //url中带有id的时候调用
    User.findOne({
        _id: id
    }, (err, user) => {
        if(err) {
            return next(err);
        } else {
            req.user = user;
            next();
        }
    });
}; 

exports.update = function (req, res, next) {    //POST请求时,在userByID中间件后调用
    //A.findByIdAndUpdate(id, update, callback) mongoose的model方法
    User.findByIdAndUpdate(req.user.id, req.body, (err, user) => {
        if(err) {
            return next(err);
        } else {
            res.json(user);
        }
    });
};

exports.delete = function (req, res, next) { //DETELE请求时调用,在中间件userByID后调用
    User.remove({_id: req.user.id}, (err) => {
        if(err) {
            return next(err);
        } else {
            res.json(req.user);
        }
    })
};

exports.userGetByUsername = function (req, res, next, username) { //url中带有username时调用
    User.findOneByUsername(username, function (err, user) {
        if(err) {
            return next(err);
        } else {
            req.user = user;
            next();
        }
    });
}

