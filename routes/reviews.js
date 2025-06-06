const express = require('express');
const router = express.Router();
const { crearReview, obtenerReviews } = require('../controllers/reviewController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/', authenticateToken, crearReview);
router.get('/', obtenerReviews);

module.exports = router;
