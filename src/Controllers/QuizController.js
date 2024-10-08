const quizService = require('../Services/QuziService');

const quizController = {


   
    async getAllQuizClass(req, res) {
       
        const quizs = await quizService.getAllQuizClass();
        res.json(quizs);
        
    },



    async getAllQuiz(req,res){
        const quiz = await quizService.getQuizzes(req.params.id, req.params.number);
        res.json(quiz);
    },

    async getQuizImageUrl(req,res){
        const quiz = await quizService.getQuizImageUrl(req.params.id);
        res.json(quiz);
    },

    async submitResults(req,res){
        const resultData = req.body;
        const reuslt = await quizService.submitResults(resultData);
        res.json(reuslt);
    },

    async getResults(req,res){
        const reuslt = await quizService.getResults(req.params.id, req.params.answerNumber);
        res.json(reuslt);
    }

    
};

module.exports = quizController;
