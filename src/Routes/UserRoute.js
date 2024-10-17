const express = require('express');
const userController = require('../Controllers/UserController')
const router = express.Router();


router.post("/LoginIdCheck", userController.LoginIdCheck);






module.exports = router;