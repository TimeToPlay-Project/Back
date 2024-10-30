const express = require('express');
const userController = require('../Controllers/UserController')
const router = express.Router();


router.post("/LoginIdCheck", userController.LoginIdCheck);
router.get("/session", userController.Session)






module.exports = router;