angular.module('users').factory('Users', function ($resource) {
    return $resource('users/:userId', {
        userId: '@_id'
    }, {
        update : {
            method: 'PUT'
        }
    })    
})