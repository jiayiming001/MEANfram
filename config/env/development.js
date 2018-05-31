'use strict';
module.exports = {
    sessionSecret: 'developmentSessionSecret',
    minute: 1000 * 60, //cookies的有效时长为6分钟
    db: 'mongodb://localhost/mean-book?replicaSet=rs0',  //问号后面是选择单个副本集lddd
    facebook: {
        clientID: '665005417241894',
        clientSecret: 'b7695e3cb2e2ee003fcf5eba782d441a',
        callback: 'http://10.244.3.94:3000/oauth/facebook/callback'
    },
    github: {
        clientID: '570cc1def238212a5cf1',
        clientSecret: 'e4b9895ae9832b103424d3bd098f9902fd30fb2d',
        callback: 'http://10.244.3.94:3000/oauth/facebook/callback'
    }
};