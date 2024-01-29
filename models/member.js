const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Member = sequelize.define('member', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    rank: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Member;