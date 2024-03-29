const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Message = sequelize.define('message', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imageLink: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

module.exports = Message;