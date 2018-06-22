var app = angular.module("mean", [
    'ngRoute', 
    'ngResource', 
    'example', 
    'articles',
    'users',
    'chat',
    'userPage'
]);
// app.config(['$locationProvider', '$routeProvider', 
//     function ($locationProvider, $routeProvider) {
//         $locationProvider.hashPrefix("!");
//     }]
// );
