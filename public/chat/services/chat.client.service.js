angular.module('chat').service('Socket', ['Authentication', '$location', '$timeout', 
    function (Authentication, $location, $timeout) {
        if(Authentication.user) {   //判断是否有用户登陆
            this.socket = io();
        } else {
            $location.path('/');
        }

        this.on = function (eventName, callback) {  //监听evetName事件
            if(this.socket) {           //判断io()是否实例化;
                this.socket.on(eventName, function (data) {
                    $timeout(function () {  //socket客户端是第三方库,需要用$timeout触发Angular的绑定操作
                        callback(data);
                    });
                });
            }
        }


        this.emit = function (eventName, data) {   //触发eventName事件
            if(this.socket) {
                this.socket.emit(eventName, data);
            }
        }


        this.removeListener = function (eventName) {    // 取消eventName事件监听
            if(this.socket) {
                this.socket.emit(eventName);
            }
        }
    }]);