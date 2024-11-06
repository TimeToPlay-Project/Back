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
        const Q = req.body;

        console.log(Q);

        

    const images = req.files['images'] || []; // 업로드된 이미지 파일 배열
    const thumbnail = req.files['thumbnail'] || [];
    const imageIds = req.body.imageIds ? req.body.imageIds : []; // 이미지 ID 배열

  
    const fileIdMap = images.map((file, index) => ({
        id: imageIds[index], // ID는 imageIds 배열에서 가져옴
        filename: file.filename // 파일명
    }));


    

    console.log("Uploaded Images with IDs:", fileIdMap);
    if(thumbnail[0]){
        console.log("Uploaded Images with th:", thumbnail[0].filename);
    }
    res.send("s");

    }
    
}

module.exports = quizEditorController;