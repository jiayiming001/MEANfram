"use strict";
const User = require('mongoose').model('User'), //返回在models中创建的User模型
    Passport = require('passport'),
    config = require('./../../config/config.js'); 


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


exports.list = function (req, res, next) {  //查找所有的user文档,满足role!=='admin'的用户
    User.find({
        'role': {
            '$not': {
                '$in': ['admin']
            }
        }
    }, (err, users) => {
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

// exports.userGetByUsername = function (req, res, next, username) { //url中带有username时调用
//     User.findOneByUsername(username, function (err, user) {
//         if(err) {
//             return next(err);
//         } else {
//             req.user = user;
//             next();
//         }
//     });
// }


var getErrorMessage = function(err) {   //用于处理mongoose错误对象并返回统一格式的错误消息
    var message = '';                   //错误消息
    if(err.code) {                      //mongoDB索引错误代码
        switch (err.code){
            case 11000:
            case 11001:
                message = 'Username alreay exists';
                break;
            default: 
                message = "Something went wrong";
        }
    } else {                             //mongoose检验错误的err.errors对象
        for (var errName in err.errors) {
            if(err.errors[errName].message) message = err.errors[errName].message;
        }
    }
    
    return message;
};


exports.renderSigin = function (req, res, next) {   //负责登录功能的控制器
    if(!req.user) {
        res.render('signin', {
            title: 'Sign-in Form',
            message: req.flash('error') || req.flash('info') //读取flash中的消息
        });
    }else {
        return res.redirect('/');
    }
};


exports.renderSignup = function (req, res, next) {  //负责注册功能的控制器
    if(!req.user) {
        res.render('signup', {
            title: 'Sign-yp Form',
            message: req.flash('error') //读取flash中的消息
        });
    }else{
        return res.redirect('/')
    }
}

exports.signup = function (req, res, next) {  //创建新用户,创建成功就使用express提供的req.login()来创建一个登录成功的用户会话
    if(!user) {                                 //登录成功后便会注册到req.user中
        var user = new User(req.body);
        var message = null;
        if(req.body.adminpasswd === congig.adminpasswd) {
            user.role = 'admin';
        } else {
            user.provider = 'local'; 
        }
        user.save((err) => {
            if(err) {
                var message = getErrorMessage(err);
                req.flash('error', message);        //借用connect-flash模块,将消息存在会话对象flash中,到新页面一次性发送给用户
                return res.redirect('/signup');            
            }
            req.login(user, function (err) {
                if(err) return next(err);
                return res.redirect('/');
            });
        });
    }else {
        return res.redirect('/');
    }
};

exports.signout = function (req, res) {
    req.logout();       //使用passpot模块提供的req.logout(),方法退出已验证的会话
    res.redirect('/');
};


//处理OAuth用户的创建
exports.saveOAuthUserProfile = function (req, profile, done) {
    User.findOne({
        provider: profile.provider,
        providerId: profile.providerId
    }, function (err, user) {
        if(err) {
            return done(err);
        } else {
            if(!user) {
                var possibleUsername = profile.username || 
                    ((profile.email) ? profile.email.split('@')[0] : '');
                User.findUniqueUsername(possibleUsername, null, 
                function (availableUsername) {
                    profile.username = availableUsername;
                    
                    user = new User(profile);

                    user.save((err) => {
                        if(err) {
                            var message = getErrorMessage(err);

                            req.flash('error', message);
                            return res.redirect('/signup');
                        }
                        return done(err, user);
                    });
                });
            } else {
                return done(err, user);
            }
        }
    });
};


//身份验证中间件
//Passport提供了req.isAuthenticated()来验证用户是否通过身份验证
exports.requiresLogin = function (req, res, next) {
    if(!req.isAuthenticated()) {        
        return res.status(401).send({
            message: 'User is not logged in'
        });
    }

    next();
}

