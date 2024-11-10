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

    async quizClassDelete(req, res){
        const {quizClassId} = req.params;
        console.log("삭제 시도");

        try {
           
            const quizDeleteResult = await quizEditorService.quizClassDelete(quizClassId);
        
            console.log("삭제 성공");
            res.status(200).send({ message: "Quiz delete successfully" });
          } catch (error) {
            console.log("삭제 실패");
            res.status(500).send({ message: `Error in delete quizClass: ${error.message}` });
          }

    },



    async quizCraete(req, res) {
        const {quizClassId} = req.params;
        const quizData = JSON.parse(req.body.quizData);
        const quizClassFile = req.files['quizClass'] ? req.files['quizClass'][0] : null;
        const quizzesFiles = req.files['quizzes'] || [];

        // console.log("quizData : " , quizData);
        // console.log("quizClassFile : " , quizClassFile);
        // console.log("quizzesFiles : " , quizzesFiles);



        try {
           
            const quizCreateResult = await quizEditorService.quizCreate(quizData, quizClassFile, quizzesFiles);
        
            console.log("생성 성공");
            res.status(200).send({ message: "Quiz created successfully" });
          } catch (error) {
            console.log("생성 실패");
            res.status(500).send({ message: `Error in creating quiz: ${error.message}` });
          }
    },

    async quizEditUpdate(req, res){
       

        
    const {quizClassId} = req.params;
    const quizData = JSON.parse(req.body.quizData);
    const quizClassFile = req.files['quizClass'] ? req.files['quizClass'][0] : null;
    const quizzesFiles = req.files['quizzes'] || [];
    const quizzesIdInfo = req.body.quizzesIdInfo ? JSON.parse(req.body.quizzesIdInfo) : [];







    const updateState = await quizEditorService.editQuiz(quizClassId,quizData,quizClassFile,quizzesFiles,quizzesIdInfo);
    console.log(updateState);
    
    if(updateState === 200){
        res.status(200).json("success");
    }
    else{
        res.status(400).json("fail");
    }
  

    },



    async quizEditDelete(req, res) {
        const { quizId, quizClassId } = req.params;
        console.log("삭제 시작");
    
        try {
            const result = await quizEditorService.quizEditDelete(quizClassId, quizId);
    
            if (result === true) {  
                console.log("삭제 성공 result = ", result);
                res.status(200).json("success");
            } else {
                console.log("삭제할 데이터 없음");
                res.status(400).json("fail");
            }
        } catch (err) {
            console.error("삭제 중 오류 발생:", err);
            res.status(500).json({ message: "서버 오류, 다시 시도해 주세요" });
        }
    }

    
}

module.exports = quizEditorController;