const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Group = sequelize.define('group', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    inviteLink: {
        type: Sequelize.STRING,
        allowNull: false
    },
    memberCount: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Group;