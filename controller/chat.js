const sequelize = require("../util/database");
const { Op } = require('sequelize');
const Message = require('../models/message');
const User = require('../models/user');
const AWS = require('aws-sdk');
const fs = require('fs');

function uploadToS3(data, filename) {
    const BUCKET_NAME = 'expensetracker000';
    const AWS_USER_KEY = process.env.AWS_USER_KEY;
    const AWS_USER_SECRET = process.env.AWS_USER_SECRET;

    const s3Bucket = new AWS.S3({
        accessKeyId: AWS_USER_KEY,
        secretAccessKey: AWS_USER_SECRET
    });

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    };

    return new Promise((resolve, reject) => {
        s3Bucket.upload(params, (err, s3Response) => {
            if (err) {
                console.log('Something went wrong', err);
                reject(err);
            }
            else {
                console.log('sccess', s3Response);
                resolve(s3Response.Location);
            }
        })
    })
}

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
                textmsg: msg.message,
                image: msg.imageLink
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
        // console.log(12, req.params.groupId);
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
                textmsg: msg.message,
                image: msg.imageLink
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
        // console.log([req.body, req.file]);
        let fileURL = null;
        if (req.file != undefined) {
            const ext = req.file.mimetype.split("/")[1];
            const filename = `GroupChatApp-${req.user.id}/${new Date()}.${ext}`;
            fileURL = await uploadToS3(fs.createReadStream(req.file.path), filename);
            // console.log(12345, fileURL);
        }

        const savedTextMsg = await req.user.createMessage({
            message: req.body.text,
            imageLink: fileURL,
            groupId: req.body.groupId
        }, { transaction: t });

        console.log(1, req.io)
        console.log(2, req.body.socketId);

        // req.io.to(req.body.socketId).broadcast.emit('event', 'message for ther user')
        req.io.emit('event', 'message for me and others')
        await t.commit();
        res.status(200).json([
            {
                id: savedTextMsg.userId,
                msgId: savedTextMsg.id,
                textmsg: savedTextMsg.message,
                image: savedTextMsg.imageLink
            }
        ]);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
};