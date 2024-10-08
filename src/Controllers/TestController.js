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



    

    
};

module.exports = TestController;
