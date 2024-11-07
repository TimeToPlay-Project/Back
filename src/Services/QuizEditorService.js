const path = require('path');
const db = require('../Config/db');
const { rejects } = require('assert');
const fs = require('fs');


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

    async editQuiz(quizClassId,quizData,quizClassFile,quizzesFiles,quizzesIdInfo){
        return new Promise((resolve, rejects) =>{

            

            const quizClass = quizData.quizClass;
            const quizzes = quizData.quizzes;

        
            
    
           

            const quizClassUpdateQuery = `
                                            UPDATE quizclasses
                                            SET description = ?, title = ?, imageUrl = ?
                                            WHERE id = ?;`;

            const quizUpdateQuery =  `
                                            UPDATE quizzes
                                            SET answer = ?, imageUrl = ?
                                            WHERE id = ?;`;

                                            

            // const quizClassUpdateParams = []
            // const quizClassUpdateParams2 = 
            // const quizUpdateParams = 
            // const quizUpdateParams2 = 
             
        
               

            if(quizClass){
                db.query('SELECT imageUrl FROM quizclasses WHERE id = ? ', [quizClassId.id], (err,result) =>{

                if(err){
                    console.log("quizClasses에서 이미지 찾기 실패");
                }
                else{
              
         
                    const {title, description} = quizClass;

                   if(quizClassFile){
                
                    const deleteFilePath = path.join(__dirname,'..','..','public', result[0].imageUrl);

                    fs.unlink(deleteFilePath, (err) => {
                        if (err) {
                            console.error('파일 삭제 중 오류 발생:', err);
                        } else {
                            console.log('파일이 성공적으로 삭제되었습니다:', filePath);
                        }
                    });
                    

                    const filePath = path.join('uploads', quizClassFile.filename);


                    const targetDirectory = path.join(__dirname, '..','..','public','images' ,'quiz', quizClassId.id);

                    
                    const targetPath = path.join(targetDirectory, path.basename(filePath));
                    const imageUrl = path.join('images', 'quiz', quizClassId.id, quizClassFile.filename).replace(/\\/g, '/');
                    
                    if (!fs.existsSync(targetDirectory)) {
                        fs.mkdirSync(targetDirectory, { recursive: true });
                    }
                
                    
                    fs.rename(filePath, targetPath, (err) => {
                        if (err) {
                            console.error('파일 이동 중 오류 발생:', err);
                        } else {
                            console.log('파일이 성공적으로 이동되었습니다:', targetPath);
                        }
                    });

                    const quizClassUpdateParams = [description,title, imageUrl, quizClassId.id];
                    db.query(quizClassUpdateQuery, quizClassUpdateParams, (err,quizClassUpdateResult) =>{
                        if(err){
                            console.error("데이터 업데이트 중 오류 발생:", err);
                        }
                        else{
                            console.log("업데이트 성공:");
                            resolve(200);     
                        }
                    })
                }
               
                else{
                    const quizClassUpdateParams = [description,title,result[0].imageUrl, quizClassId.id];
                    db.query(quizClassUpdateQuery, quizClassUpdateParams, (err,quizClassUpdateResult) =>{
                        if(err){
                            console.error("quizClasses 데이터 업데이트 중 오류 발생:", err);
                        }
                        else{
                            console.log("quizClasses 업데이트 성공:");
                            resolve(200);     
                        }
                    })
                }
                }
                })
            }
            if (quizzes){
                quizzes.forEach((quiz) =>{
                    db.query('SELECT imageUrl FROM quizzes WHERE id = ? ', [quiz.id], (err,result) =>{

                        if(err){
                            console.log("quiz에서 이미지 찾기 실패");
                        }
                        else{
                    

                    const {answer} = quiz;

                    if(quizzesIdInfo.some(item => item.id === quiz.id)){
                        

                                const deleteFilePath = path.join(__dirname,'..','..','public', result[0].imageUrl);

                                fs.unlink(deleteFilePath, (err) => {
                                    if (err) {
                                        console.error('파일 삭제 중 오류 발생:', err);
                                    } else {
                                        console.log('파일이 성공적으로 삭제되었습니다:', filePath);
                                    }
                                });

                                
                                
                                const currentQuizIdInfo = quizzesIdInfo.find((quizinfo) => quizinfo.id === quiz.id);
                                
                              
                                const filePath = path.join('uploads', currentQuizIdInfo.fileName);


                                const targetDirectory = path.join(__dirname, '..','..','public', 'images', 'quiz', quizClassId.id);
                    

                                const targetPath = path.join(targetDirectory, path.basename(filePath));
                                const imageUrl = path.join('images', 'quiz', quizClassId.id, currentQuizIdInfo.fileName).replace(/\\/g, '/');
                                
                                
                                if (!fs.existsSync(targetDirectory)) {
                                    fs.mkdirSync(targetDirectory, { recursive: true });
                                }
                            
                                
                                fs.rename(filePath, targetPath, (err) => {
                                    if (err) {
                                        console.error('파일 이동 중 오류 발생:', err);
                                    } else {
                                        console.log('파일이 성공적으로 이동되었습니다:', targetPath);
                                    }
                        });

                        console.log("###### : ", imageUrl);
                        const quizUpdateParams = [quiz.answer, imageUrl, quiz.id];
                        db.query(quizUpdateQuery, quizUpdateParams, (err, quizzesUpdateResult) => {
                            if(err){
                                console.error("quiz 데이터 업데이트 중 오류 발생:", err);
                            }
                            else{
                                console.log("quiz 업데이트 성공:");
                                resolve(200);     
                            }
            
            
                    })
                
                   
                }
                else{
                    const quizUpdateParams = [quiz.answer, result[0].imageUrl, quiz.id];
                    db.query(quizUpdateQuery, quizUpdateParams, (err, quizzesUpdateResult) => {
                        if(err){
                            console.error("quiz 데이터 업데이트 중 오류 발생:", err);
                        }
                        else{
                            console.log("quiz 업데이트 성공:");
                            resolve(200);     
                        }
        
        
                    })
                }
                }
            });
    
            })
        }
    })    
    }


}

module.exports = quizEditorService;