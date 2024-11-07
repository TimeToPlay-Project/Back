const express = require('express');
const userController = require('../Controllers/UserController')
const router = express.Router();


//  '/api/user'

router.post("/LoginIdCheck", userController.LoginIdCheck);
router.get("/session", userController.Session)
router.post("/login", userController.Login)






module.exports = router;