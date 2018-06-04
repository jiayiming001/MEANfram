'use strict';

var config = require('./config'),
    cookieParser = require('cookie-parser'),
    passport = require('passport');

module.exports = function (server, io, mongoStore) {
    io.use(function (socket, next) {  
        //使用cookieParser来解析握手请求中的cookie,并且获取对应express中的sessionId
        cookieParser(config.sessionSecret)(socket.request, {}, function (err) {
            var sessionId = socket.request.signedCookiesp['connect.sid'];

            //使用mongoStore检索会话信息
            mongoStore.get(sessionId, function (err, session) {
                socket.request.session = session;

                //一旦检索到就用passport.initialize()和passport.session()中间件根据会话
                //信息来填充会话的user对象
                passport.initialize()(socket.request, {}, function () {
                    passport.session()(socket.request, {}, function () {
                        if(socket.request.user) {
                            next(null, true);
                        } else {
                            next(new Error('User is not authenticated'), false);
                        }
                      });
                });
            });
        });
    });


    io.on('connection', function (socket) {
        require('../app/controllers/chat.server.controller')(io, socket);
    });
};