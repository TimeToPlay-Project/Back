const express = require('express');
const quizEditorController = require('../Controllers/QuizEditorController');
const router = express.Router();
const multer = require('multer');
const path = require('path');



let firstUploadFileState = false;


const storage = multer.diskStorage({

    destination: function (req, file, cb) {


        const uploadPath = !firstUploadFileState ? 'uploads/' : 'uploads2/';
        firstUploadFileState = true;


        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }


});


const upload = multer({ storage: storage });

const uploadFields = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images' }
]);


router.get('/:quizId', quizEditorController.getQuizEditData);
router.post('/submit/:id', uploadFields, quizEditorController.quizEditUpdate);





module.exports = router;
