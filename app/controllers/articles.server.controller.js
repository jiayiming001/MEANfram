'use strict';
const Mongoose = require('mongoose'),
    Article = Mongoose.model('Article');

var getErrorMessage = function (err) {          //错误处理函数,每次返回第一个错误的message
    if(err.errors) {
        for(var errName in err.errors) {
            if(err.errors[errName].message) return err.errors[errName].message;
        }
    }else{
        return "Unknown server error"
    }
};

exports.create = function (req, res) {
    var article = new Article(req.body);
    article.creator = req.user;

    article.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        }else {
            res.json(article);
        }
   });
};


exports.list = function (req, res) {
    Article.find().sort('-created').populate('creator', 'firstName lastName fullName').
        exec(function (err, articles) {
            if(err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                })
            }else {
                res.json(articles);
            }
        })
};


exports.articleByID = function (req, res, id, next) {
    Article.findById(id).populate('creator', 'firstName lastName fullName').exec
        (function (err, article) {
            if(err) return next(err);
            if(!article) return next(new Error('Failed to load article' + id));

            req.article = article;
            next();
        });
};


exports.read = function (req, res) {
    res.json(req.article);
};


exports.update = function (req, res) {    
    var article = res.article;

    article.title = req.body.title;
    article.content = req.body.content;
    article.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        }else {
            res.json(article);
        }
    });
};


exports.delete = function (req, res) {
    var article = req.article;

    article.remove(function (err) {
        if(err){
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        }else {
            res.json(article);
        }
    });
}


//授权中间件(只有creator可以更新和删除文章)
exports.hasAuthorization = function (req, res, next) {
    if(req.article.creator.id !== req.user.id) {
        return res.status(403),send({
            message: 'User is not suthorized'
        });
    }
    next();
};
