const express = require('express');
const TestController = require('../Controllers/TestController');

const router = express.Router();



router.get('/testClass/all', TestController.getAllTestClass);
router.get('/testClass/imageUrl/:id', TestController.getTestImageUrl);









module.exports = router;
