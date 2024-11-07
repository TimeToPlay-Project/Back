const quizEditorService = require("../Services/QuizEditorService");

const quizEditorController = {

    async getQuizEditData(req,res){
        const QuizId = req.params.quizId;

        try {
            const QuizDataById = await quizEditorService.getQuizEditData(QuizId);
            res.json(QuizDataById);
        }
        catch(error){
            res.status(400).json("error : " + error);
        }

    },


    async quizCreate(req, res) {
        const resultData = req.body; 
        const files = req.files; 
    
        if (!files || files.length === 0) {

            return res.status(400).json({ message: '파일이 전송되지 않았습니다.' });
            
        }
    
        files.forEach((file, index) => {


            console.log(`File ${index}:`, file);

            
        });

        res.send("00");
    
        
    },

    async quizEditUpdate(req, res){
       

        
    const quizClassId = req.params;
    const quizData = JSON.parse(req.body.quizData);
    const quizClassFile = req.files['quizClass'] ? req.files['quizClass'][0] : null;
    const quizzesFiles = req.files['quizzes'] || [];
    const quizzesIdInfo = req.body.quizzesIdInfo ? JSON.parse(req.body.quizzesIdInfo) : [];






    // try{
        const updateState = await quizEditorService.editQuiz(quizClassId,quizData,quizClassFile,quizzesFiles,quizzesIdInfo);
    // }
    // catch(err){

    // }








    res.status(200).json("success");

    }
    
}

module.exports = quizEditorController;