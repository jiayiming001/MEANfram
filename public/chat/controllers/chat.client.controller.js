angular.module('chat')
    .controller('ChatController', ['$scope', 'Socket',
    function ($scope, Socket) {
        var self = this;
        $scope.messages = [];
        Socket.on('chatMessage', function (message) {
            $scope.messages.push(message);
        });

        $scope.sendMessage = function () {
            console.log(self.messageText);
            var message = {
                text: self.messageText,
            }

            Socket.emit('chatMessage', message);
            self.messageText = '';
        }

        $scope.destory = function () {  //离开聊天室
            Socket.removeListener('chatMessage');
        }
}]);