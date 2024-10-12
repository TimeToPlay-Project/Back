

const db = require('../Config/db');



const testService = {
    

    async getAllTestClass() {
        return new Promise((resolve, reject) => {
            db.query('select * from testclasses', (err, results) => {
                if (err) {
                    console.error('error fetching quiz classes:', err);
                    reject(err);
                } else {
                    
                    resolve(results);     
                }
            });
        });
    },

    async getTestImageUrl(TestClassId) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM testclasses WHERE id = ?', [TestClassId], (err, results) => {
                if (err) {
                    console.error('Error fetching quiz classes:', err);
                    reject(err);
                } else {

                    const TestClassImageUrl = results[0].imageUrl;
          
            
            
                    resolve(TestClassImageUrl);
                }
            });
        });
    },

    async getTestByTestClassId(TestClassId) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM tests WHERE testclassesId = ?', [TestClassId], (err, results1) => {
                if (err) {
                    console.error('Error fetching tests:', err);
                    return reject(err);
                }
    
                db.query('SELECT * FROM testanswers', (err, results2) => {
                    if (err) {
                        console.error('Error fetching test answers:', err);
                        return reject(err);
                    }
    
                   
                    const combinedArray = results1.map((question) => ({
                        id: question.id,
                        question: question.question,
                        imageUrl: question.imageUrl,
                        answers: results2
                            .filter(answer => answer.testId === question.id) 
                            .map(answer => ({
                                id: answer.id,
                                answer: answer.answer,
                                type: answer.type,
                            })),
                    }));
    
                    resolve(combinedArray);
                });
            });
        });
    },
    

    async TestAnswerSubmit(resultData) {
        return new Promise((resolve, reject) => {
            console.log('Received resultData:', resultData);
            const { id, answers } = resultData; 
    
            const query = 'SELECT * FROM testResults';
            
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching test results:', err);
                    return reject(err); 
                } 
    
        
                const wordCount = {};
    
    
                answers.forEach(answer => {
                
                    const words = answer.split(',').map(word => word.trim());
                    
                    words.forEach(word => {
                
                        if (wordCount[word]) {
                            wordCount[word]++;
                        } else {
                            wordCount[word] = 1;
                        }
                    });
                });
    
                // 가장 많이 중복된 단어 찾기
                const getMostFrequentWord = (wordCount) => {
                    let maxCount = 0;
                    let mostFrequentWord = '';
                    
                    for (const word in wordCount) {
                        if (wordCount[word] > maxCount) {
                            maxCount = wordCount[word];
                            mostFrequentWord = word;
                        }
                    }
                    
                    return mostFrequentWord;
                };
    
           
                const mostFrequentWord = getMostFrequentWord(wordCount);
                console.log('Most frequent word:', mostFrequentWord);
            


                
                // 최빈도 단어와 같은 type 값을 가진 결과 찾기
                const matchingResult = results.find(result => result.type === mostFrequentWord);

              
    
                if (matchingResult) {
                    const res = [matchingResult.result, matchingResult.resultDescription, matchingResult.imageUrl];
                    resolve(res); 
                } else {
                    console.log("No matching result found.");
                    resolve(null); 
                }
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

module.exports = testService;
