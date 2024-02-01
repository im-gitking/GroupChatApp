const sequelize = require("../util/database");
const { Op } = require('sequelize');
const Message = require('../models/message');
const User = require('../models/user');
const Group = require("../models/group");

exports.getAllMembers = async (req, res, next) => {
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

