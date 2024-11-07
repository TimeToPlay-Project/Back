const UserService = require('../Services/UserService');



const UserController = {

    async LoginIdCheck(req,res){
        const loginId = req.body;
        console.log(loginId);
        const LoginIdCheckState = await UserService.LoginIdCheck(loginId);

        console.log("결과 : "+LoginIdCheckState);
        res.json(LoginIdCheckState);
    },

    async Session(req,res){
        
        res.status(200).json("session information")
        
    },

    async Login(req,res){
        const loginInfo = req.body;
        const LoginResult = await UserService.Login(loginInfo);
        console.log("req : " + LoginResult);
        if(LoginResult === 200){
            res.status(200).json("success");
        }
        else{
            res.status(400).json("fail");
        }

    }



}


module.exports = UserController;