const express = require('express');
const quizController = require('../Controllers/QuizController');
const router = express.Router();


router.get('/quiz/results/:id/:answerNumber', quizController.getResults);
router.get('/quizClass/all', quizController.getAllQuizClass);
router.get('/quizClass/imageUrl/:id', quizController.getQuizImageUrl);
router.get('/quiz/:id/:number', quizController.getAllQuiz);






router.post('/quiz/results/submit', quizController.submitResults);


module.exports = router;
