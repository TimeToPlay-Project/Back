const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../Config/db'); 

const QuizClass = sequelize.define('QuizClass', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    timestamps: false
});

QuizClass.sync();

module.exports = QuizClass;
