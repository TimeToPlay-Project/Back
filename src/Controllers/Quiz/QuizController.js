const quizService = require('../../Services/Quiz/QuziService');

const quizController = {


   
    async getAllQuizClass(req, res) {
       
        const quizs = await quizService.getAllQuizClass();
        res.json(quizs);
        
    },

    async getResult(req, res) {
       
        const quizs = await quizService.getAllQuizClass();
        res.json(quizs);
        
    },

    async getQuiz(req,res){
        const quiz = await quizService.getQuizzes(req.params.id, req.params.number);
        res.json(quiz);
    },

    async getQuizImageUrl(req,res){
        const quiz = await quizService.getQuizImageUrl(req.params.id);
        res.json(quiz);
    }

    // async updateUser(req, res) {
    //     try {
    //         const [updated] = await userService.updateUser(req.params.id, req.body);
    //         if (!updated) {
    //             return res.status(404).json({ message: 'User not found' });
    //         }
    //         res.json({ message: 'User updated successfully' });
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // },

    // async deleteUser(req, res) {
    //     try {
    //         const deleted = await userService.deleteUser(req.params.id);
    //         if (!deleted) {
    //             return res.status(404).json({ message: 'User not found' });
    //         }
    //         res.status(204).send();
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // },
};

module.exports = quizController;
