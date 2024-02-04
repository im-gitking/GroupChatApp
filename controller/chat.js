const sequelize = require("../util/database");
const { Op } = require('sequelize');
const Message = require('../models/message');
const User = require('../models/user');
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

AWS.config.update({
    accessKeyId: process.env.AWS_USER_KEY,
    secretAccessKey: process.env.AWS_USER_SECRET
});

const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'expensetracker000',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
});

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


exports.postMessage = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        // Use multer middleware to handle the file upload
        console.log(req.body);
        upload.single(req.body.file)(req, res, async function(err) {
            if (err) {
                // Handle any errors from the file upload
                console.error('Upload Error:', err);
                await t.rollback();
                return res.status(500).send(err);
            }
            // File has been uploaded successfully
            console.log('Successfully uploaded ' + req.body.file.location + '!');

            // Continue with your existing logic here...
        });
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
};
