const UserService = require('../Services/UserService');
const { redisClient, redisStore } = require('../Config/redis');


const UserController = {

    async LoginIdCheck(req,res){
        const loginId = req.body;
        console.log(loginId);
        const LoginIdCheckState = await UserService.LoginIdCheck(loginId);

        console.log("결과 : "+LoginIdCheckState);
        res.json(LoginIdCheckState);
    },

   

    async Login(req,res){
        const loginInfo = req.body;
        const LoginResult = await UserService.Login(loginInfo);
        
        console.log(LoginResult);


        if(LoginResult){
            delete LoginResult.password;
            req.session.user = LoginResult;
    
            
                res.status(200).json(LoginResult);
     
        }
       
        
        else{
            res.status(400).json("fail");
        }

    },

    

    async Logout(req, res) {
        try {
            const sessionId = req.sessionID;
            console.log("세션 ID:", req.cookies);

            req.session.destroy(async (err) => {
                if (err) {
                    console.log("로그아웃 실패", err);
                    return res.status(500).json({ message: '로그아웃 실패' });
                }

                // 쿠키 삭제
                res.clearCookie('connect.sid', {
                    path: '/',
                    httpOnly: true,
                    secure: false
                });

                // Redis에서 세션 삭제
                // await new Promise((resolve, reject) => {
                //     redisClient.del(`session:${sessionId}`, (err, response) => {
                //         if (err) {
                //             console.log("Redis에서 세션 삭제 실패", err);
                //             reject(err);
                //         } else {
                //             console.log("Redis 세션 삭제 성공:", response);
                //             resolve(response);
                //         }
                //     });
                // });

                console.log("로그아웃 성공");
                return res.status(200).json({ message: '로그아웃 성공' });
            });
        } catch (error) {
            console.log("로그아웃 중 오류 발생", error);
            return res.status(500).json({ message: '로그아웃 중 오류 발생' });
        }
    },

    
    

    async checkLogin(req, res) {
        if (req.session && req.session.user) {
            console.log("로그인 확인 완료");
            res.status(200).json({ isLoggedIn: true, user: req.session.user });
        } else {
            console.log("로그인 안됨");
            res.status(200).json({ isLoggedIn: false });
        }
    },

    async join(req,res){
        
        const {name, loginId, password, nickName, phoneNumber} = req.body;

        

        const joinResult = await UserService.join(name, loginId, password, nickName, phoneNumber);
        
        console.log("##### : " ,joinResult);

        if(joinResult === 200){
            res.status(200).json("success");
        }
        else{
            res.status(400).json("fail");
        }

    }




}


module.exports = UserController;