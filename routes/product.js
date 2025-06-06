const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middleware/authenticateToken');
const validateProduct = require('../middleware/validateProduct');

// Ruta para crear la tabla 'Product' directamente con SQL (pública)
router.get('/crear-tabla', productController.crearTablaProductos);

// Filtros y ordenamientos protegidos (requieren autenticación)
router.get('/filtro/precio', authenticateToken, productController.buscarPorPrecio);
router.get('/ordenar/precio-desc', authenticateToken, productController.ordenarPorPrecioDesc);

// Buscar productos por nombre (query ?nombre=xxx) - protegido
router.get('/buscar', authenticateToken, productController.buscarPorNombre);

// Rutas públicas para obtener productos
router.get('/', productController.obtenerProductos);
router.get('/:id', productController.obtenerProductoPorId);

// Rutas protegidas para crear, actualizar y eliminar productos
router.post('/', authenticateToken, validateProduct, productController.crearProducto);
router.put('/:id', authenticateToken, validateProduct, productController.actualizarProducto);
router.delete('/:id', authenticateToken, productController.eliminarProducto);

module.exports = router;
