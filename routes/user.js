const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Registro y Login
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// Perfil protegido
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;
