const express = require('express');
const quizController = require('../Controllers/QuizController');
const router = express.Router();
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix); 
    }
});

const upload = multer({ storage: storage });


router.get('/quiz/results/:id/:answerNumber', quizController.getResults);
router.get('/quizClass/all', quizController.getAllQuizClass);
router.get('/quizClass/imageUrl/:id', quizController.getQuizImageUrl);
router.get('/quiz/:id/:number', quizController.getAllQuiz);






router.post('/quiz/results/submit', quizController.submitResults);
router.post('/quiz/AA',  upload.array('postImg'), quizController.quizCreate);


module.exports = router;
