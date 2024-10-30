

const db = require('../Config/db');



const quizService = {
    

    async getAllQuizClass() {
        return new Promise((resolve, reject) => {
            db.query('select * from quizclasses', (err, results) => {
                if (err) {
                    console.error('error fetching quiz classes:', err);
                    reject(err);
                } else {
                    
                    resolve(results);     
                }
            });
        });
    },

    async getQuizImageUrl(QuizClassId) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM quizclasses WHERE id = ?', [QuizClassId], (err, results) => {
                if (err) {
                    console.error('Error fetching quiz classes:', err);
                    reject(err);
                } else {

                    const quizClassImageUrl = results[0].imageUrl;
          
            
            
                    resolve(quizClassImageUrl);
                }
            }); 
        });
    },

    async getQuizzes(QuizClassId, Number){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM quizzes WHERE quizClassId = ?', [QuizClassId],(err, results) => {
                if (err) {
                    console.error('Error fetching quiz classes:', err);
                    reject(err);
                } else {

                

                    if (results.length === 0) {
                        return []; 
                    }
                    
                    function shuffleArray(array) {
                        for (let i = array.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [array[i], array[j]] = [array[j], array[i]]; 
                        }
                        return array;
                    }
                                
                  
                    const randomQuizzes = shuffleArray(results).slice(0, Number);
                    
                    resolve(randomQuizzes);     
                }
            });
        });
    },

    async submitResults(resultData) {
        return new Promise((resolve, reject) => {
            console.log('Received resultData:', resultData);
            const { answerNumber, quizClassId } = resultData; 
            
            const InsertQuizResults = 'INSERT INTO ttp.quizResults (answerNumber, quizClassId) VALUES (?, ?)';
            const SelectQuizResultsFromQuizClassId = 'SELECT * FROM quizResults WHERE quizClassId = ?';
            
            db.query(InsertQuizResults, [answerNumber, quizClassId], (err, results) => {
                if (err) {
                    console.error('Error inserting quiz results:', err);
                    return reject(err); 
                } 
    
                db.query(SelectQuizResultsFromQuizClassId, [quizClassId], (err, res) => {
                    if (err) {
                        console.error('Error fetching quiz results:', err);
                        return reject(err); 
                    } 
          
    
                    let sum = 0;
                    for(let i=0; i<res.length; i++){
                        sum += res[i].answerNumber;
                    }
   
                    const av = sum/res.length;

                    
                    resolve(av); 
                });
            });
        });
    },

    async getResults(QuizClassId, answerNum) {
        return new Promise((resolve, reject) => {
            db.query('select * from quizresults WHERE quizClassId = ? ',[QuizClassId], (err, results) => {
                if (err) {
                    console.error('error fetching quiz classes:', err);
                    reject(err);
                } else {
                    

                
                const counts = Array.from({ length: 11 }, (_, index) => ({ answerNumber: index, count: 0 }));

               
                results.forEach(result => {
                    if (result.answerNumber >= 0 && result.answerNumber <= 10) {
                        counts[result.answerNumber].count++;
                    }
                });

         
                const totalResults = results.length;

            
                const topCount = results.filter(result => result.answerNumber >= answerNum).length; 
                
           
                const topPercentage = totalResults > 0 ? ((topCount / totalResults) * 100).toFixed(2) : "0.00"; 

              
                resolve({ counts, topPercentage });
                }
            });
        });
    },
    
    

    

   
};

module.exports = quizService;
