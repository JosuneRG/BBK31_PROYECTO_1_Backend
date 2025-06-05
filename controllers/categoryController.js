const { Category, Product } = require('../models');
const { sequelize } = require('../models');

const categoryController = {
  // Crear tabla Category con SQL (opcional si usas Sequelize migrations)
  crearTablaCategorias: async (req, res) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS Category (
        category_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
      )
    `;

    try {
      await sequelize.query(sql);
      res.json({ mensaje: 'Tabla Category creada correctamente con SQL' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear categoría
  crearCategoria: async (req, res) => {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });

    try {
      const categoria = await Category.create({ name, description });
      res.status(201).json(categoria);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 1. Obtener todas las categorías con sus productos
  obtenerCategorias: async (req, res) => {
    try {
      const categorias = await Category.findAll({
        include: {
          model: Product,
          as: 'products',
          through: { attributes: [] }
        }
      });
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 2. Obtener categoría por ID con productos
  obtenerCategoriaPorId: async (req, res) => {
    try {
      const categoria = await Category.findByPk(req.params.id, {
        include: {
          model: Product,
          as: 'products',
          through: { attributes: [] }
        }
      });

      if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar categoría
  actualizarCategoria: async (req, res) => {
    const { name, description } = req.body;

    try {
      const categoria = await Category.findByPk(req.params.id);
      if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

      await categoria.update({ name, description });
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar categoría
  eliminarCategoria: async (req, res) => {
    try {
      const categoria = await Category.findByPk(req.params.id);
      if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

      await categoria.destroy();
      res.json({ mensaje: 'Categoría eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = categoryController;
