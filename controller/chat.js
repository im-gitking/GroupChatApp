const sequelize = require("../util/database");

exports.postTextMessage = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const textMessage = req.body;
        console.log(textMessage);
        const savedTextMsg = await req.user.createMessage(textMessage, {transaction: t});
        
        await t.commit();
        res.status(200).json({msgText: savedTextMsg.message});
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
}

exports.getMessage = (req, res, next) => {
    
}

exports.delteMessage = (req, res, next) => {
    
}