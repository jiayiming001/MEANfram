'use strict';
const articles = require('../controllers/articles.server.controller'),
    users = require('../controllers/users.server.controller');

module.exports = function (app) {
    app.route('/api/articles')
        .get(articles.list)
        .post(users.requiresLogin, articles.create);

    app.route('/api/articles/:articleId')
        .get(articles.read)
        .put(users.requiresLogin, articles.hasAuthorization, articles.update)
        .delete(users.requiresLogin, articles.hasAuthorization, articles.delete);

    app.param('articleId', articles.articleByID); //参数路由
}