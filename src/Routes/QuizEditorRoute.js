const express = require('express');
const quizEditorController = require('../Controllers/QuizEditorController');
const router = express.Router();
const multer = require('multer');
const path = require('path');





const storage = multer.diskStorage({

    destination: function (req, file, cb) {


        const uploadPath = 'uploads/' ;

        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
       
        cb(null, file.originalname);
    }


});


const upload = multer({ storage: storage });




router.get('/:quizId', quizEditorController.getQuizEditData);
router.post('/submit/:quizClassId', upload.fields([
    { name: 'quizClass'},
    { name: 'quizzes'}
]), quizEditorController.quizEditUpdate);





module.exports = router;
