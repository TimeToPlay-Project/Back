const express = require('express');
const quizController = require('../../Controllers/Quiz/QuizController');
const router = express.Router();


// router.post('/quiz', userController.createUser);
router.get('/quizClass/all', quizController.getAllQuizClass);
router.get('/quiz/imageUrl/:id', quizController.getQuizImageUrl);
router.get('/quiz/:id/:number', quizController.getQuiz);

// router.put('/users/:id', userController.updateUser);
// router.delete('/users/:id', userController.deleteUser);

module.exports = router;
