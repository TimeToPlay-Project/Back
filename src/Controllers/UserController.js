const UserService = require('../Services/UserService');



const UserController = {

    async LoginIdCheck(req,res){
        const loginId = req.body;
        console.log(loginId);
        const LoginIdCheckState = await UserService.LoginIdCheck(loginId)

        console.log("결과 : "+ LoginIdCheckState);
        res.json(LoginIdCheckState);
    }



}


module.exports = UserController;