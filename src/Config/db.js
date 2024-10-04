const { Sequelize } = require('sequelize');

// Sequelize 인스턴스 생성
const sequelize = new Sequelize('TTP', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
});

// 데이터베이스 연결 테스트
sequelize.authenticate()
    .then(() => {
        console.log('데이터 베이스 연결 성공.');
    })
    .catch(err => {
        console.error('데이터 베이스 연결 오류 : ', err);
    });

module.exports = sequelize;
