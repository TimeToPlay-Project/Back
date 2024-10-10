const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const quizRoutes = require('./src/Routes/QuizRoute');
const testRoutes = require('./src/Routes/TestRoute');
const tournamentRoutes = require('./src/Routes/TournamentRoute');
const sequelize = require('./src/Config/db2'); 

const app = express();



// 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 라우트 설정
app.use('/api', quizRoutes);
app.use('/api', testRoutes);
app.use('/api/tournament', tournamentRoutes);



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`서버 시작 포트 - ${PORT}`);
});

