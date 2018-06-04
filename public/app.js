var app = angular.module("mean", [
    'ngRoute', 
    'ngResource', 
    'example', 
    'articles',
    'users',
    'chat'
]);
// app.config(['$locationProvider', '$routeProvider', 
//     function ($locationProvider, $routeProvider) {
//         $locationProvider.hashPrefix("!");
//     }]
// );
