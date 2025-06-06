const express = require('express');
const router = express.Router();

// Handler temporal para evitar error por falta de authController
router.post('/login', (req, res) => {
  res.send('Login aún no implementado.');
});

module.exports = router;
