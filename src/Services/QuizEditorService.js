const fs = require('fs').promises;
const path = require('path');
const db = require('../Config/db');

const quizEditorService = {


    async getQuizEditData(QuizId){
        
        return new Promise((resolve, reject) =>{

            const getQuizClass = 'SELECT * FROM quizclasses WHERE id = ?'
            const getQuizData = 'SELECT * FROM quizzes WHERE quizClassId = ?'

            db.query(getQuizClass, [QuizId], (err, QuizCalssData) => {
                if(err){
                    console.log('ERROR BY QUIZCLASS : ' + err);
                    reject(err);
                }
                else{

                    db.query(getQuizData,[QuizId],(err,QuizData) => {
                        

                        if(err){
                            console.log('ERROR BY QUIZ : '+err);
                            reject(err);
                        }
                        else{

                            console.log(QuizCalssData);
                            console.log(QuizData);
                            resolve({'quizClass':QuizCalssData[0], 'quizzes':QuizData});



                        }

                    })



                }
            })


        })
    }


}

module.exports = quizEditorService;