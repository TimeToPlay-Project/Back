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

    async editQuiz(quizClassId, quizData, quizClassFile, quizzesFiles, quizzesIdInfo) {
        return new Promise((resolve, rejects) => {
          const quizClass = quizData.quizClass;
          const quizzes = quizData.quizzes;
      
          const quizClassUpdateQuery = `
            UPDATE quizclasses SET description = ?, title = ?, imageUrl = ? WHERE id = ?;`;
      
          const quizUpdateQuery = `
            UPDATE quizzes SET answer = ?, imageUrl = ? WHERE id = ?;`;
      
          const quizClassUpdatePromise = new Promise((resolve, reject) => {

            if (quizClass) {
              db.query('SELECT imageUrl FROM quizclasses WHERE id = ? ', [quizClassId], (err, result) => {
                if (err) return reject("quizClasses에서 이미지 찾기 실패");
      
                const { title, description } = quizClass;
                const previousImageUrl = result[0]?.imageUrl;
      
               
                if (quizClassFile) {
                  const deleteFilePath = path.join(__dirname, '..', '..', 'public', previousImageUrl);
                  fs.unlink(deleteFilePath, () => {});
      
                  const filePath = path.join('uploads', quizClassFile.filename);
                  const targetDirectory = path.join(__dirname, '..', '..', 'public', 'images', 'quiz', quizClassId);
                  const targetPath = path.join(targetDirectory, path.basename(filePath));
                  const imageUrl = path.join('images', 'quiz', quizClassId, quizClassFile.filename).replace(/\\/g, '/');
      
                  if (!fs.existsSync(targetDirectory)) fs.mkdirSync(targetDirectory, { recursive: true });
                  fs.rename(filePath, targetPath, () => {});
      
                  const quizClassUpdateParams = [description, title, imageUrl, quizClassId];
                  db.query(quizClassUpdateQuery, quizClassUpdateParams, (err) => {
                    if (err){
                        reject("quizClasses 데이터 업데이트 중 오류 발생");
                    }
                    else resolve("quizClasses 업데이트 성공");
                  });
                } 
                else {

                  const quizClassUpdateParams = [description, title, previousImageUrl, quizClassId];
                  db.query(quizClassUpdateQuery, quizClassUpdateParams, (err) => {
                    if (err){
                        reject("quizClasses 데이터 업데이트 중 오류 발생");
                    }
                    else resolve("quizClasses 업데이트 성공");
                  });

                }
              });
            } else {
              resolve("quizClassNotUpdate");
            }
          });
      
          const quizzesUpdatePromises = quizzes.map((quiz) => {
            return new Promise((resolve, reject) => {

              db.query('SELECT imageUrl FROM quizzes WHERE id = ?', [quiz.id], (err, result) => {
                if (err) {
                    return reject("quiz에서 이미지 찾기 실패");
                }
      
                const { answer } = quiz;
                const previousImageUrl = result[0]?.imageUrl;
                const currentQuizIdInfo = quizzesIdInfo.find((item) => item.id === quiz.id);
                const newQuizIdInfo = quizzesIdInfo.filter((item) => item.id === 'new');
              

               
                if(quiz.id === 'new'){
                    const newQuizIdInfo2 = newQuizIdInfo.find((item) => item.id === 'new');

                    console.log("$$$$$$$$$$$ : " ,quiz);

                        const filePath = path.join('uploads', quiz.fileName);
                        const targetDirectory = path.join(__dirname, '..', '..', 'public', 'images', 'quiz', quizClassId);
                        const targetPath = path.join(targetDirectory, path.basename(filePath));
                        const imageUrl = path.join('images', 'quiz', quizClassId, quiz.fileName).replace(/\\/g, '/');
            
                        if (!fs.existsSync(targetDirectory)) fs.mkdirSync(targetDirectory, { recursive: true });
                        fs.rename(filePath, targetPath, () => {});
            
                        const insertQuizQurey = 'INSERT INTO quizzes (answer, imageUrl) VALUES (?, ?) '
                        db.query(insertQuizQurey, [quiz.answer, imageUrl], (err) => {
                          if (err){
                              reject("quiz 데이터 업데이트 중 오류 발생");
                          }
                          else resolve("quiz 업데이트 성공");
      
                    });
                  

                   
                    
                }
          
                if (currentQuizIdInfo) {

                  const deleteFilePath = path.join(__dirname, '..', '..', 'public', previousImageUrl);
                  fs.unlink(deleteFilePath, () => {});
      
                  const filePath = path.join('uploads', currentQuizIdInfo.fileName);
                  const targetDirectory = path.join(__dirname, '..', '..', 'public', 'images', 'quiz', quizClassId);
                  const targetPath = path.join(targetDirectory, path.basename(filePath));
                  const imageUrl = path.join('images', 'quiz', quizClassId, currentQuizIdInfo.fileName).replace(/\\/g, '/');
      
                  if (!fs.existsSync(targetDirectory)) fs.mkdirSync(targetDirectory, { recursive: true });
                  fs.rename(filePath, targetPath, () => {});
      
                  const quizUpdateParams = [answer, imageUrl, quiz.id];
                  db.query(quizUpdateQuery, quizUpdateParams, (err) => {
                    if (err){
                        reject("quiz 데이터 업데이트 중 오류 발생");
                    }
                    else resolve("quiz 업데이트 성공");

                  });
                } 
                else {

                  const quizUpdateParams = [answer, previousImageUrl, quiz.id];
                  db.query(quizUpdateQuery, quizUpdateParams, (err) => {
                    if (err){ 
                        reject("quiz 데이터 업데이트 중 오류 발생");
                    }
                    else resolve("quiz 업데이트 성공");

                  });
                }
              });
            });
          });
      

          Promise.all([quizClassUpdatePromise, ...quizzesUpdatePromises])
            .then(() => resolve(200))
            .catch((err) => rejects(err));
        });
      }
      


}

module.exports = quizEditorService;