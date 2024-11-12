const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const quizRoutes = require('./src/Routes/QuizRoute');
const testRoutes = require('./src/Routes/TestRoute');
const tournamentRoutes = require('./src/Routes/TournamentRoute');
const quizEditorRoute = require('./src/Routes/QuizEditorRoute');
const testEditorRoute = require('./src/Routes/TestEditorRoute');
const tournamentEditorRoute = require('./src/Routes/TournamentEditorRoute');
const userRoutes = require('./src/Routes/UserRoute');
const sequelize = require('./src/Config/db2');
const { redisStore } = require('./src/Config/redis'); 

dotenv.config();
global.appRoot = require('path').resolve(__dirname);

const app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
    name: "session_ID",
    store: redisStore,
    secret: process.env.SESSION_SECRET || 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false, 
        path: '/'
    }
}));





// 라우트 
app.use('/api', quizRoutes);
app.use('/api', testRoutes);
app.use('/api/tournament', tournamentRoutes);
app.use('/api/editor/quiz', quizEditorRoute);
app.use('/api/editor/test', testEditorRoute);
app.use('/api/editor/tournament', tournamentEditorRoute);
app.use('/api/user', userRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`서버 시작 포트 - ${PORT}`);
});
