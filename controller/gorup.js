const sequelize = require("../util/database");
const { v4: uuidv4 } = require('uuid');
const Group = require('../models/group');
const Member = require('../models/member');
const { where } = require("sequelize");

exports.createGroup = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const groupCreated = await Group.create({
            name: req.body.groupName,
            inviteLink: uuidv4(),
            memberCount: 1
        }, { transaction: t });

        let createMemberOwner = await groupCreated.createMember({
            rank: 'Owner',
            userId: req.user.id
        }, { transaction: t });

        await t.commit();
        res.status(200).json(groupCreated);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
}

exports.joinedGroup = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const members = await req.user.getMembers({ transaction: t });
        const allJoinedGroups = await Promise.all(members.map(member => member.getGroup({ transaction: t })));

        console.log(allJoinedGroups);

        await t.commit();
        res.status(200).json(allJoinedGroups);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
}

exports.openGroup = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const groupId = req.params.id;
        const groupDetails = await Group.findByPk(groupId, { transaction: t });
        // const allJoinedGroups = await Promise.all(members.map(member => member.getGroup()));

        console.log(groupDetails);

        await t.commit();
        res.status(200).json({ groupDetails: groupDetails });
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
}

exports.groupDetails = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const groupToken = req.params.inviteId;
        const groupDetails = await Group.findAll({
            where: {
                inviteLink: groupToken
            }
        }, { transaction: t });
        // const allJoinedGroups = await Promise.all(members.map(member => member.getGroup()));

        console.log(groupDetails);

        await t.commit();
        res.status(200).json(groupDetails[0]);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
    }
}

exports.joinMember = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const groupId = req.params.groupId;

        const [memberObj, created] = await Member.findOrCreate({
            where: {
                groupId: groupId,
                userId: req.user.id
            },
            defaults: {
                rank: 'Member'
            },
            transaction: t
        });

        if (created) {
            await Group.update(
                { memberCount: sequelize.literal('memberCount + 1') },
                { where: { id: groupId }, transaction: t }
            );
        }

        await t.commit();
        res.status(200).json({ success: created ? 'Member was created' : 'Member already exists' });

    } catch (err) {
        await t.rollback();
    }
}