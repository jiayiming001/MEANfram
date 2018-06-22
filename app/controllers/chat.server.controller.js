'use strict';
module.exports = function (io, socket) {
    io.emit('chatMessage', {    //通过io对象向所有监听'chatMessage'事件的客户端发送消息
        type: 'status',
        text: 'connencted',
        created: Date.now(),
        username: socket.request.user.username
    });


    socket.on('chatMessage', (message) => { //监听socket客户端'chatMeaasge'事件
        message.type = 'message';
        message.created = Date.now();
        message.username = socket.request.user.username;

        io.emit('chatMessage', message);
    });


    socket.on('disconnect', () => {    //监听socket客户端与服务器断开建立的事件,并且触发回调
        io.emit('chatMessage', {
            type: 'status',
            text: 'disconnected',
            created: Date.now(),
            username: socket.request.user.username
        });
    });
};