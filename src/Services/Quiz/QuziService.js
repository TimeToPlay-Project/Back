
const QuizClass = require('../../Models/Quiz/QuizClassModel');
const Quiz = require('../../Models/Quiz/QuizModel');



const quizService = {
    

    async getAllQuizClass() {
        try {
            const quizClasses = await QuizClass.findAll(); 
            if(quizClasses==null){
                return null;
            }
            return quizClasses;
            
        } catch (error) {
            console.error('Error fetching quiz classes:', error);
            throw error;
        }
        
    },

    async getQuizImageUrl(QuizClassId) {
        try {
            const quizClass = await QuizClass.findOne({
                where: { id: QuizClassId } 
            });

            console.log(quizClass);
            const quizClassImageUrl = quizClass.imageUrl;
          
            
            return quizClassImageUrl;
            
        } catch (error) {
            console.error('Error fetching quiz classes:', error);
            throw error;
        }
        
    },


    async getQuizzes(QuizClassId, Number){
        try {
            const quizzes = await Quiz.findAll({
                where: { quizClassId: QuizClassId } 
            });
    
        
            if (quizzes.length === 0) {
                return []; 
            }

            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]]; 
                }
                return array;
            }
            
            // quizzes 배열을 섞고, Number 개수만큼 자르기
            const randomQuizzes = shuffleArray(quizzes).slice(0, Number);
            
            return randomQuizzes;


    
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            throw error; 
        }
    },


    async createUser(userData) {
        const user = new Quiz(userData);
        return await user.save();
    },
    

    async updateUser(userId, userData) {
        return await Quiz.update(userData, { where: { id: userId } });
    },

    async deleteUser(userId) {
        return await Quiz.destroy({ where: { id: userId } });
    },
};

module.exports = quizService;
