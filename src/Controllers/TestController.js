const testService = require('../Services/TestService');

const TestController = {


   
    async getAllTestClass(req, res) {
       
        const tsets = await testService.getAllTestClass();
        res.json(tsets);
        
    },

    async getTestImageUrl(req,res){
        const test = await testService.getTestImageUrl(req.params.id);
        res.json(test);
    },

    async getTestByTestClassId(req,res){
        const result = await testService.getTestByTestClassId(req.params.testClassId);
        res.json(result);
    },

    async TestAnswerSubmit(req,res){
        const resultData = req.body;
        const result = await testService.TestAnswerSubmit(resultData);
        res.json(result);
    },




    

    
};

module.exports = TestController;
