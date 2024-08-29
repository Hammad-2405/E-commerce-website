const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/checkstore/:username', userController.checkStore);
router.post('/addStore', userController.addStore);

module.exports = router;