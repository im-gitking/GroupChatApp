const sequelize = require("../util/database");
const { Op } = require('sequelize');
const Message = require('../models/message');
const User = require('../models/user');
const Group = require("../models/group");
const Member = require("../models/member");

exports.getAllMembers = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const groupMemers = await Member.findAll({
            include: [{
                model: User,
                as: 'user'
            }],
            where: {
                groupId: req.params.groupId
            }
        }, { transaction: t });

        await t.commit();
        res.status(200).json(groupMemers);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
}

exports.promoteMember = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const getMember = await Member.findOne({
            where: {
                id: req.body.targetMember,
                groupId: req.body.groupId
            },
            transaction: t
        });

        if (getMember.rank === 'Member') {
            getMember.rank = 'Admin';
        }
        else {
            getMember.rank = 'Member';
        }
        await getMember.save({ transaction: t });

        await t.commit();
        res.status(200).json(getMember);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
};

exports.removeMember = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const removeMember = await Member.destroy({
            where: {
                id: req.body.targetMember,
                groupId: req.body.groupId
            },
            transaction: t
        });

        await Group.update(
            { memberCount: sequelize.literal('memberCount - 1') },
            { where: { id: req.body.groupId }, transaction: t }
        );

        await t.commit();
        res.status(200).json(removeMember);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
}

exports.searchMember = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        // console.log(req.body);
        let where = {};
        if (req.body.name) {
            where.name = req.body.name;
        }
        else if (req.body.email) {
            where.email = req.body.email;
        }
        else {
            where.number = req.body.number;
        }

        const searchResult = await User.findOne({
            where
        }, { transaction: t });

        const result = {};
        result.user = {};
        
        if (searchResult) {
            const checkIfAlreadyJoined = await searchResult.getMembers({
                where: {
                    groupId: req.body.groupId
                }
            }, { transaction: t });

            if (checkIfAlreadyJoined.length > 0) {
                result.userfound = true;
                result.inGroup = true;
                result.id = checkIfAlreadyJoined[0].id;
                result.rank = checkIfAlreadyJoined[0].rank;
                result.user.name = searchResult.name;
            }
            else {
                result.userfound = true;
                result.inGroup = false;
                result.user.id = searchResult.id;
                result.user.name = searchResult.name;
            }
        } 
        else {
            result.userfound = false;
        }

        await t.commit();
        res.status(200).json(result);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
};

exports.addMember = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const [memberObj, created] = await Member.findOrCreate({
            where: {
                groupId: req.body.groupId,
                userId: req.body.userId
            },
            defaults: {
                rank: 'Member'
            },
            include: [{
                model: User,
                as: 'user'
            }],
            transaction: t
        });

        if (created) {
            await Group.update(
                { memberCount: sequelize.literal('memberCount + 1') },
                { where: { id: req.body.groupId }, transaction: t }
            );
        }

        await t.commit();
        res.status(200).json(memberObj);
    } 
    catch (err) {
        await t.rollback();
    }
};