const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


//Ruta para crear la tabla 'Product' directamente con SQL
router.get('/crear-tabla', productController.crearTablaProductos);

// Crear producto
router.post('/', productController.crearProducto);

// Obtener todos los productos con categorías
router.get('/', productController.obtenerProductos);

// Obtener producto por id
router.get('/:id', productController.obtenerProductoPorId);

// Actualizar producto por id
router.put('/:id', productController.actualizarProducto);

// Eliminar producto por id
router.delete('/:id', productController.eliminarProducto);

module.exports = router;
