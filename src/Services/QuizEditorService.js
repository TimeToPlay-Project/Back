const path = require('path');
const db = require('../Config/db');
const { rejects } = require('assert');
const fs = require('fs').promises;

function dbQuery(query, params) {
  return new Promise((resolve, reject) => {
      db.query(query, params, (err, results) => {
          if (err) {
              reject(err);
          } else {
              resolve(results);
          }
      });
  });
}

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


    async quizCreate(quizData,quizClassFile,quizzesFiles){

      const quizClass = quizData.quizClass;
      const quizzes = quizData.quizzes;
      console.log("여기까지 됌");

      try {
        const insertQuizQuery = "INSERT INTO quizclasses (title, description, imageUrl) VALUES(?, ?, ?)";
        const insertQuizResults = await dbQuery(insertQuizQuery, [quizClass.title, quizClass.description, "1"]);
        const newQuizId = insertQuizResults.insertId;
        const tmpDir = path.join(global.appRoot, 'tmp');
        const quizDir = path.join(global.appRoot, 'public', 'images', 'quiz', newQuizId.toString());
        await fs.mkdir(quizDir, { recursive: true });

        if(quizClassFile){
          const targetPath = path.join(quizDir, quizClassFile.filename);
          await fs.rename(quizClassFile.path, targetPath);
          const imageUrl = `images/quiz/${newQuizId}/${quizClassFile.filename}`;

          const updateQuizQuery = "UPDATE quizclasses SET imageUrl=? WHERE id=?";
          dbQuery(updateQuizQuery, [imageUrl, newQuizId]);
        }
        let quizIndex = 0;
        for(const quiz of quizzes){
         
          let imageUrl = null;
          console.log("quizIndex", quizIndex);
          console.log("quizzesFiles", quizzesFiles[quizIndex]);
          if (quizzesFiles[quizIndex]) {
            
            const quizFileName = quizzesFiles[quizIndex];
            const tmpPath = path.join(tmpDir, quizFileName.filename);
            const targetPath = path.join(quizDir, quizFileName.filename);
            await fs.rename(tmpPath, targetPath);

            imageUrl = `images/quiz/${newQuizId}/${quizFileName.filename}`;
          }

          const insertquizzeseQuery = "INSERT INTO quizzes(answer, imageUrl, quizClassId) VALUES(?, ?, ?)"


          const insertquizzeseQueryParamas = [quiz.answer, imageUrl, newQuizId]

              
          await dbQuery(insertquizzeseQuery, insertquizzeseQueryParamas);

          quizIndex++;
      } 
        return 200;
      } catch (error) {
        console.log("서비스에서 실패 : ", error);
        throw new Error(`Error in createTournament: ${error.message}`);
    }
   
    },

    async editQuiz(quizClassId, quizData, quizClassFile, quizzesFiles, quizzesIdInfo) {
        return new Promise((resolve, rejects) => {
          const newQuizIdInfoList = quizzesIdInfo.filter((item) => item.id === "new");
          const quizClass = quizData.quizClass;
          const quizzes = quizData.quizzes;
          const tmpDir = path.join(global.appRoot, 'tmp');
          const tournamentDir = path.join(global.appRoot, 'public', 'images', 'quiz', quizClassId);
      
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
                  const deleteFilePath = path.join(global.appRoot, 'public', previousImageUrl);
                  fs.unlink(deleteFilePath, () => {});
      
                  const filePath = path.join(tmpDir, quizClassFile.filename);
                  const targetDirectory = path.join(tournamentDir);
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
                

               

               
                if (quiz.id === 'new') {

                  const newQuizIdInfo = newQuizIdInfoList.shift();
                  
                  console.log("11111111111  : " , quizzesIdInfo);
                  console.log("2222222222222 : " , newQuizIdInfo);
                  
                  if (newQuizIdInfo) {
                    const filePath = path.join(tmpDir, newQuizIdInfo.fileName);
                    const targetDirectory = path.join(tournamentDir);
                    const targetPath = path.join(targetDirectory, path.basename(filePath));
                    const imageUrl = path.join('images', 'quiz', quizClassId, newQuizIdInfo.fileName).replace(/\\/g, '/');
                    console.log("filePath : ",filePath);
                    console.log("targetDirectory : ",targetDirectory);
                    console.log("targetPath : ", targetPath);
                    console.log("imageUrl : ", imageUrl);
                
                    if (!fs.existsSync(targetDirectory)) fs.mkdirSync(targetDirectory, { recursive: true });
                    fs.rename(filePath, targetPath, () => {});
                
                    const insertQuizQuery = 'INSERT INTO quizzes (answer, imageUrl, quizClassId) VALUES (?, ?, ?)';
                    db.query(insertQuizQuery, [quiz.answer, imageUrl, quizClassId], (err) => {
                      if (err) {
                        reject("quiz 데이터 업데이트 중 오류 발생");
                      } else {
                        console.log("업데이트 후 퀴즈들 : ", newQuizIdInfoList);
                        resolve("quiz 업데이트 성공");
                      }
                    });
                  } else {
                    reject("newQuizIdInfo에서 'new' id를 찾을 수 없습니다.");
                  }
                }
                
                
                   
                    
                
          
                if (previousImageUrl) {

                  const deleteFilePath = path.join(global.appRoot, 'public', previousImageUrl);
                  fs.unlink(deleteFilePath, () => {});

                  console.log("$$$$$$$$$$$ : " ,currentQuizIdInfo);
      
                  const filePath = path.join(tmpDir, currentQuizIdInfo.fileName);
                  const targetDirectory = path.join(tournamentDir);
                  const targetPath = path.join(targetDirectory, path.basename(filePath));
                  const imageUrl = path.join('images', 'quiz', quizClassId, currentQuizIdInfo.fileName).replace(/\\/g, '/');
                  console.log("filePath : ",filePath);
                    console.log("targetDirectory : ",targetDirectory);
                    console.log("targetPath : ", targetPath);
                    console.log("imageUrl : ", imageUrl);
      
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
      },


      async quizClassDelete(quizClassId) {

        const deleteQuiClasszInQuizzesQuery = "DELETE FROM quizzes WHERE quizClassId = ? ";
        const deleteQuiClasszQuery = "DELETE FROM quizclasses WHERE id = ? ";
        const deleteQuiClasszInQuizzesResults = await dbQuery(deleteQuiClasszInQuizzesQuery, [quizClassId]);
        const deleteQuiClasszResults = await dbQuery(deleteQuiClasszQuery, [quizClassId]);
        
      },

      async quizEditDelete(quizClassId, quizId) {
        const quizDeleteQuery = `DELETE FROM quizzes WHERE id = ? AND quizClassId = ?`;
        console.log("quizId : ", quizId);
        console.log("quizClassId : ", quizClassId);
    
        return new Promise((resolve, reject) => {
            db.query(quizDeleteQuery, [quizId, quizClassId], (err, result) => {
                if (err) {
                    console.log("퀴즈 삭제에서 에러가 생김 : ", err);
                    reject(err);  
                } else {
                    if (result.affectedRows > 0) {  
                        console.log("퀴즈 삭제 성공");
                        resolve(true);  
                    } else {
                        console.log("삭제할 데이터 없음");
                        resolve(false); 
                    }
                }
            });
        });
    }
      


}

module.exports = quizEditorService;