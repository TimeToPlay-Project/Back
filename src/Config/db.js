
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',     
    password: 'root',  
    database: 'TTP'   
});


connection.connect((err) => {
    if (err) {
        console.error('데이터 베이스 연결 실패 :', err.stack);
        return;
    }
    console.log('데이터 베이스 연결 성공');
});


module.exports = connection;
