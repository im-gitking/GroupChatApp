const chat = require('./chat');

// called once per user while connection & assigning socket.id to that user
module.exports = (socket) => {
    console.log('A user connected via Socket.IO:', socket.id);
    // called once per user 
    console.log(1, socket.id);

    // called as many times as 'inbox-message' event occours
    socket.on('inbox-message', (message, room) => {
        console.log(2, socket.id);
        socket.on('post-message', (message) => {
            chat.messageHandler(socket, message);
        });
    });
    
    // group all messages
    socket.on('group all messages', (room, cb) => {
        chat.getAllGroupMessage(socket, room, cb);
    });

    // joining room
    socket.on('send message', (formData, cb) => {
        chat.messegeOperator(socket, formData, cb);
    });

    // Leaving room
    socket.on('leave-room', (room, cb) => {
        chat.roomLeaver(socket, room, cb);
    });
};