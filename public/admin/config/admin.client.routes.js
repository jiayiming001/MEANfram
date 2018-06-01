angular.module('admin')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/admin/:userId', {
            templateUrl: "admin/views/admin.client.view.html"
        }).
        when('/admin/signin', {
            templateUrl: "admin/views/signin-admin.client.view.html"
        }).
        when('/admin/signup', {
            templateUrl: "admin/views/signup-admin.client.view.html"
        })
    }]);