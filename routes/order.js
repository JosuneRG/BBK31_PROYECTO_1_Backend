const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Ver pedidos con productos
router.get('/', orderController.getOrdersWithProducts);

// Crear pedido
router.post('/', orderController.addOrder);

module.exports = router;
