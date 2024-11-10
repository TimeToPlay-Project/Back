const express = require('express');
const quizEditorController = require('../Controllers/QuizEditorController');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//app.use('/api/editor/quiz', quizEditorRoute);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(global.appRoot, 'tmp');

      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
          return cb(err); 
        }
        cb(null, dir); 
      });
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); 
    }
  });



const upload = multer({ storage: storage });




    router.get('/:quizId', quizEditorController.getQuizEditData);
    router.post('/create', upload.fields([
        { name: 'quizClass'},
        { name: 'quizzes'}
    ]), quizEditorController.quizCraete);
    router.post('/submit/:quizClassId', upload.fields([
        { name: 'quizClass'},
        { name: 'quizzes'}
    ]), quizEditorController.quizEditUpdate);

    router.delete('/quizClass/delete/:quizClassId', quizEditorController.quizClassDelete)
    router.delete('/delete/:quizClassId/:quizId', quizEditorController.quizEditDelete);





module.exports = router;
