angular.module('userPage')
    .component('userPage', {
        templateUrl: "/components/user-page/user-page.view.html",
        controller: ["$scope", "$location",'Authentication',
            function ($scope, $location,Authentication) {
                $scope.authentication = Authentication;
                $scope.username = "user";
        }]
    })