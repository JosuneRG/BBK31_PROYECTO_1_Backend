const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');


// Ruta para crear la tabla 'Category' directamente con SQL
router.get('/crear-tabla', categoryController.crearTablaCategorias);

// Crear categoría
router.post('/', categoryController.crearCategoria);

// Obtener todas las categorías con productos
router.get('/', categoryController.obtenerCategorias);

// Obtener categoría por id
router.get('/:id', categoryController.obtenerCategoriaPorId);

// Actualizar categoría por id
router.put('/:id', categoryController.actualizarCategoria);

// Eliminar categoría por id
router.delete('/:id', categoryController.eliminarCategoria);

module.exports = router;
