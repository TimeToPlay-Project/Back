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
    },

    async Login(loginInfo){
        return new Promise((resovle,reject) =>{
            const {loginId, loginPW} = loginInfo;

            
            db.query("SELECT * from user WHERE loginId = ?",[loginId], (err, result) => {
                if(err){
                    console.error('Error fetching quiz classes:', err);
                    reject(err);
                }
                else{


                    if(result[0].password === loginPW){
                        
                        resovle(result[0]);
                    }
                    else{
                        resovle(null);
                    }

                }
            })

        })
    }



}

module.exports = UserService;