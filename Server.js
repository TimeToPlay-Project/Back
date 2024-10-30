const express = require('express');
const session = require('express-session') 
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const quizRoutes = require('./src/Routes/QuizRoute');
const testRoutes = require('./src/Routes/TestRoute');
const tournamentRoutes = require('./src/Routes/TournamentRoute');
const userRoutes = require('./src/Routes/UserRoute');
const sequelize = require('./src/Config/db2'); 
const dotenv = require('dotenv');


const app = express();
dotenv.config();



app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
        origin : "http://localhost:3000",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//session 설정 

app.use(session({
    name: "session_ID",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: false,
        secure: false,
    }
}))

app.use("/", (req, res, next) =>{
    try{
        if(req.session.views){
            req.session.views++;
        }
        else{
            req.session.views = 1;
        }
        console.log('session Info', req.session);
        next();
    }
    catch(error){
        console.error(error);
        next(error);
    }
})




app.use('/api', quizRoutes);
app.use('/api', testRoutes);
app.use('/api/tournament', tournamentRoutes);
app.use('/api/user', userRoutes);



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`서버 시작 포트 - ${PORT}`);
});

