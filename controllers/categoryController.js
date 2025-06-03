const { Categoria, Producto } = require('../models');
const { sequelize } = require('../models');

module.exports = {
    //Crear tabla Category con SQL
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
    const { nombre } = req.body;

    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

    try {
      const categoria = await Categoria.create({ nombre });
      res.status(201).json(categoria);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //1. Obtener todas las categorías con sus productos
  obtenerCategorias: async (req, res) => {
    try {
      const categorias = await Categoria.findAll({
        include: { model: Producto, as: 'productos' },
      });
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 2.Obtener categoría por id con productos
  obtenerCategoriaPorId: async (req, res) => {
    try {
      const categoria = await Categoria.findByPk(req.params.id, {
        include: { model: Producto, as: 'productos' },
      });
      if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar categoría
  actualizarCategoria: async (req, res) => {
    const { nombre } = req.body;

    try {
      const categoria = await Categoria.findByPk(req.params.id);
      if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

      await categoria.update({ nombre });
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar categoría
  eliminarCategoria: async (req, res) => {
    try {
      const categoria = await Categoria.findByPk(req.params.id);
      if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

      await categoria.destroy();
      res.json({ mensaje: 'Categoría eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

}