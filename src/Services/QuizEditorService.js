const fs = require('fs').promises;
const path = require('path');
const db = require('../Config/db');
const { rejects } = require('assert');

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
    },

    async editQuiz(quizData,quizClassFile,quizzesFiles){
        return new Promise((resolve, rejects) =>{


            

            const quizClass = quizData.quizClass;
            const quizzes = quizData.quizzes;

           

            const quizClassUpdateQuery = `
                                            UPDATE QuizClass
                                            SET description = ?, title = ?, imageUrl = ?
                                            WHERE id = ?;`;

            const quizzesUpdateQuery =  `
                                            UPDATE Quizzes
                                            SET description = ?, title = ?, imageUrl = ?
                                            WHERE id = ?;`;
                                            

        
               

            if(quizClass){
                const {title, description} = quizClass;
                db.query(quizClassUpdateQuery, [], (err,quizClassUpdateResult) =>{
                    if(err){

                    }
                    else{

                    }
                })
            }
            quizzes.forEach((quiz) =>{
                const {answer} = quiz;

                db.query(quizzesUpdateQuery, [], (err, quizzesUpdateResult) => {
                    if(err){
    
                    }
                    else{
    
                        
                    }
    
    
            })
                 
            })
    })    
    }


}

module.exports = quizEditorService;