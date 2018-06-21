angular.module('users')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
        when('/admin/userList', {
            templateUrl: '/users/views/users.client.view.html'
        }).
        otherwise({
            redirectTo: '/admin/userList'
        });
  }]);
