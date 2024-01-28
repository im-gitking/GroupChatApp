const sequelize = require("../util/database");
const Message = require('../models/message');
const User = require('../models/user');

exports.postTextMessage = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const textMessage = req.body;
        console.log(textMessage);
        const savedTextMsg = await req.user.createMessage(textMessage, { transaction: t });

        await t.commit();
        res.status(200).json([
            {
                id:savedTextMsg.userId,
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
        const getAllTextMessages = await Message.findAll({
            include: [{
                model: User,
                as: 'user'
            }]
        }, { transaction: t });

        const messageObj = [];
        getAllTextMessages.forEach(msg => {
            messageObj.push({
                id:msg.userId,
                from: msg.user.name,
                textmsg: msg.message
            });
        });
        // console.log(messageObj);

        await t.commit();
        res.status(200).json(messageObj);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
}


exports.delteMessage = (req, res, next) => {

}