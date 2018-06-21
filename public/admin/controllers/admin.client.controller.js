angular.module('admin')
    .controller(['$scope', 'Articles', 'Users','$location', '$routeParams', 
    function($scope, Articles, Users,$location, $routeParams){
        var data  = this;


        $scope.adminSignin = function () {
            Users.save({
                username: data.username,
                password: data.password
            }, function (response) {
                $location.path("admin/" + response._id);
            }, function (errResponse) {
                $scope.error = errResponse.data.message;
            })
        };


        $scope.adminSignup = function () {
            Users.save({
                username: data.username,
                password: data.password,
                email: data.email,           
            })
        }
    }]);