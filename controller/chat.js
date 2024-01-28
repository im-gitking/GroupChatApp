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
        res.status(200).json({ msgText: savedTextMsg.message });
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
}

exports.getMessage = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const getAllTextMessages = await Message.findAll();

        const messageObj = [];
        for (const msg of getAllTextMessages) {
            try {
                const user = await User.findOne({ where: { id: msg.userId } });

                messageObj.push({
                    from: user.name,
                    textmsg: msg.message
                });
            }
            catch (err) {
                await t.rollback();
                console.error('Error Caught: ', err);
            }
        }
        console.log(messageObj);
        res.status(200).json(messageObj);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
}


exports.delteMessage = (req, res, next) => {

}