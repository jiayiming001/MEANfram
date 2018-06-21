angular.module('users')
    .factory('Admin', function ($resource) {
       return $resource(
           'admin/userlist/:userId',
           {userId: '@_id'}, //@的作用是使用资源实例调用时，@id对应的是实例的属性id
           {}
        ) 
    })