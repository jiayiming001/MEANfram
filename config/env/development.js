'use strict';
module.exports = {
    sessionSecret: 'developmentSessionSecret',
    minute: 1000 * 60, //cookies的有效时长为6分钟
    db: 'mongodb://localhost/mean-book',
    facebook: {
        clientID: '665005417241894',
        clientSecret: 'b7695e3cb2e2ee003fcf5eba782d441a',
        callback: 'http://10.244.3.94:3000/oauth/facebook/callback'
    }
};