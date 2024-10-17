const db = require("../Config/db")

const UserService = {


    async LoginIdCheck(loginIdData){
        return new Promise((resolve, reject) => {
            const {loginId} = loginIdData;
            console.log(loginId);
            db.query('SELECT * FROM USER WHERE loginId = ?', [loginId], (err, result) => {
                if(err){
                    console.error('Error fetching quiz classes:', err);
                    reject(err);
                }
                else{

                    console.log("디비 :" + result);

                    if(result.length>0){
                        resolve("duplicate");
                    }else{
                        resolve("ok");
                    }

                    
                }
            })
        })
    }



}

module.exports = UserService;