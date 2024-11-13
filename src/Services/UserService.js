const db = require("../Config/db");
const bcrypt = require('bcrypt');

const saltRounds = 10; 


async function hashPassword(password) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

function dbQuery(query, params) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
  }

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

    async Login(loginInfo) {
        const { loginId, loginPW } = loginInfo;
    
        try {
          const result = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM user WHERE loginId = ?", [loginId], (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          });
    
          if (result.length > 0) {
            const storedPassword = result[0].password;  
    
      
            const isPasswordValid = await bcrypt.compare(loginPW, storedPassword);
    
            if (isPasswordValid) {
              return result[0];  
            } else {
              return null;  
            }
          } else {
            return null; 
          }
        } catch (err) {
          console.error('Error during login:', err);
          throw err;  
        }
      },

    async join(name, loginId, password, nickName, phoneNumber){
        const hashedPassword = await hashPassword(password);

        const joinQuery = "INSERT INTO user (name, loginId, password, nickName, phoneNumber) VALUES(?, ?, ?, ?, ?)";
        const joinQueryParams = [name, loginId, hashedPassword, nickName, phoneNumber];

        try{
            await dbQuery(joinQuery, joinQueryParams);
            return 200;
        }
        catch(err){
            console.log("회원가입 DB오류 : ", err);
            return 400;
        }


    }



}

module.exports = UserService;