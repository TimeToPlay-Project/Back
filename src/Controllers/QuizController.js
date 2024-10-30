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
    },

    async quizCreate(req, res) {
        const resultData = req.body; // JSON 형식으로 받은 데이터
        const files = req.files; // multer로 처리된 파일들
    
        if (!files || files.length === 0) {
            return res.status(400).json({ message: '파일이 전송되지 않았습니다.' });
        }
    
        files.forEach((file, index) => {
            console.log(`File ${index}:`, file);
            // 여기서 파일을 다른 곳으로 이동시키거나 추가적인 처리를 할 수 있습니다.
        });
    
        // 추가적인 처리 로직...
    }
    

    
};

module.exports = quizController;
