angular.module('users')
    .controller('userController', ['$scope','$http','Authentication','Admin','$location',
        function ($scope, $http,Authentication, Admin,$location) {
            $scope.authentication = Authentication;

            $scope.getUserList = function () {
                Admin.query({}, (Response)=> {
                    $scope.users = Response;
                }, (err) => {
                    $scope.message = err;
                })
            }

            
            $scope.deleteUser = function (user) {
                if(user){
                    user.$remove(()=>{
                        for(let i in $scope.users) {
                            if($scope.users[i] === user) {
                                $scope.users.splice(i,1);
                            }
                        }
                    });
                }else {
                    $scope.$remove(()=>{
                        $location.path('/');
                    })
                } 
            }
                
    }]);