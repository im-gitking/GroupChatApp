const sequelize = require("../util/database");
const { Op } = require('sequelize');
const Message = require('../models/message');
const User = require('../models/user');
const Group = require("../models/group");

exports.postTextMessage = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const textMessage = req.body;
        console.log(textMessage);
        const savedTextMsg = await req.user.createMessage({
            message: textMessage.message,
            groupId: textMessage.id
        }, { transaction: t });

        await t.commit();
        res.status(200).json([
            {
                id: savedTextMsg.userId,
                msgId: savedTextMsg.id,
                textmsg: savedTextMsg.message
            }
        ]);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
}

exports.getMessage = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        // Get last 10 messages
        let getAllTextMessages = await Message.findAll({
            include: [{
                model: User,
                as: 'user'
            }],
            where: {
                groupId: req.params.groupId
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
                textmsg: msg.message
            });
        });
        console.log(messageObj);

        await t.commit();
        res.status(200).json(messageObj);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
}

exports.newMessages = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const lastMsgId = req.body.lastMsgId;
        console.log(req.params.groupId);
        let newTextMsgs = await Message.findAll({
            where: {
                id: {
                    [Op.gt]: lastMsgId,  // Op.gt stands for 'greater than'
                },
                groupId: req.params.groupId
            },
            include: [{
                model: User,
                as: 'user'
            }],
            limit: 10,
            order: [['id', 'DESC']]
        }, { transaction: t });

        newTextMsgs = newTextMsgs.reverse();

        const messageObj = [];
        newTextMsgs.forEach(msg => {
            messageObj.push({
                id: msg.userId,
                msgId: msg.id,
                from: msg.user.name,
                textmsg: msg.message
            });
        });
        console.log(messageObj);

        t.commit();
        res.status(200).json(messageObj);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
}


exports.delteMessage = (req, res, next) => {

}