const express = require('express');
const userController = require('../Controllers/UserController')
const router = express.Router();


//  '/api/user'

router.get("/check-login", userController.checkLogin);

router.post("/LoginIdCheck", userController.LoginIdCheck);
router.post("/login", userController.Login);
router.post("/logout", userController.Logout);






module.exports = router;