const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../Config/db'); 
const QuizClass = require('./QuizClassModel'); 

const Quiz = sequelize.define('Quiz', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quizClassId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: QuizClass, 
            key: 'id' 
        }
    }
}, {
    tableName: 'quizzes',
    timestamps: false
});


Quiz.belongsTo(QuizClass, { foreignKey: 'quizClassId' }); 

Quiz.sync();

module.exports = Quiz;
