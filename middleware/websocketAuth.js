const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Authenticaton of WebSocket Connection request
module.exports = async (socket, next) => {
    try {
        if (socket.handshake.auth.token) {
            // also asigning 'user id' from User table to each socket connection
            socket.userId = await assignSocketUserId(socket.handshake.auth.token);
            console.log('user.id: ', socket.userId);
            next();
        } else {
            next(new Error('Please send token'));
        }
    } catch (err) {
        console.error('Caught error: ', err);
        next(new Error('Token verification failed'))
    }
};

const assignSocketUserId = async (token) => {
    try {
        const userDetails = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        const user = await User.findByPk(userDetails.userID)
        return user.id;
    } catch (err) {
        console.error('Caught error: ', err);
    }
};