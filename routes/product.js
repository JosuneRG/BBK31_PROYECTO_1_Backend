const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middleware/authenticateToken');
const validateProduct = require('../middleware/validateProduct');


//Ruta para crear la tabla 'Product' directamente con SQL
router.get('/crear-tabla', productController.crearTablaProductos);

// Crear producto
router.post('/', authenticateToken, validateProduct, productController.crearProducto);


// Obtener todos los productos con categorías
router.get('/', productController.obtenerProductos);

// Obtener producto por id
router.get('/:id', productController.obtenerProductoPorId);

// Actualizar producto por id
router.put('/:id', productController.actualizarProducto);

// Eliminar producto por id
router.delete('/:id', productController.eliminarProducto);

module.exports = router;
