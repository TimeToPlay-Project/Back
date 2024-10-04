const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../Config/db'); 
const Quiz = require('./QuizModel'); 

const QuizResult = sequelize.define('QuizResult', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    answerNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    kind: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quizId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: Quiz, 
            key: 'id' 
        }
    }
}, {
    tableName: 'quizResults',
    timestamps: false
});


QuizResult.belongsTo(Quiz, { foreignKey: 'quizId' });


QuizResult.sync();


module.exports = QuizResult;
