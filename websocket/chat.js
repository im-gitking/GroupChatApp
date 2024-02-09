const sequelize = require("../util/database");
const { Op } = require('sequelize');
const Message = require('../models/message');
const User = require('../models/user');
const AWS = require('aws-sdk');
const fs = require('fs');

exports.getAllGroupMessage = async (socket, room, cb) => {
    socket.join(room);
    const t = await sequelize.transaction();
    try {
        // Get last 10 messages
        let getAllTextMessages = await Message.findAll({
            include: [{
                model: User,
                as: 'user'
            }],
            where: {
                groupId: room
            },
            limit: 10,
            order: [['id', 'DESC']]
        }, { transaction: t });

        getAllTextMessages = getAllTextMessages.reverse();  // correct order

        const messageObj = [];
        getAllTextMessages.forEach(msg => {
            messageObj.push({
                id: msg.userId,
                msgId: msg.id,
                from: msg.user.name,
                textmsg: msg.message,
                image: msg.imageLink
            });
        });
        console.log(123, messageObj);

        await t.commit();
        cb(messageObj);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
}

exports.messegeOperator = (socket, formData, cb) => {
    console.log(1234);

}

exports.roomLeaver = (socket, room, cb) => {
    socket.leave(room);
    cb(`Left ${room}`);
}