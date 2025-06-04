const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Endpoint para registro
router.post('/user', userController.register);

module.exports = router;
