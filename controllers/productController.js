const { Producto, Categoria } = require('../models');
const { sequelize } = require('../models');


module.exports = {

//Crear la tabla product usando SQL
 crearTablaProductos: async (req, res) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS Product (
        product_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL,
        category_id INT,
        FOREIGN KEY (category_id) REFERENCES Category(category_id)
      )
    `;

    try {
      await sequelize.query(sql);
      res.json({ mensaje: 'Tabla Product creada correctamente con SQL' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

// Crear producto con categorías (categorias es array de ids)
  crearProducto: async (req, res) => {
    const { nombre, descripcion, precio, categorias } = req.body;

    if (!nombre || !descripcion || !precio || !categorias || !Array.isArray(categorias)) {
      return res.status(400).json({ error: 'Faltan campos o categorias no es un array' });
    }

    try {
      const producto = await Producto.create({ nombre, descripcion, precio });

      // Asociar categorías
      await producto.setCategorias(categorias);

      // Traer producto con categorías para respuesta
      const productoConCategorias = await Producto.findByPk(producto.id, {
        include: { model: Categoria, as: 'categorias' },
      });

      res.status(201).json(productoConCategorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener todos los productos con categorías
  obtenerProductos: async (req, res) => {
    try {
      const productos = await Producto.findAll({
        include: { model: Categoria, as: 'categorias' },
      });
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener producto por id con categorías
  obtenerProductoPorId: async (req, res) => {
    try {
      const producto = await Producto.findByPk(req.params.id, {
        include: { model: Categoria, as: 'categorias' },
      });
      if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

      res.json(producto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar producto y categorías
  actualizarProducto: async (req, res) => {
    const { nombre, descripcion, precio, categorias } = req.body;

    try {
      const producto = await Producto.findByPk(req.params.id);
      if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

      await producto.update({ nombre, descripcion, precio });

      if (categorias && Array.isArray(categorias)) {
        await producto.setCategorias(categorias);
      }

      const productoActualizado = await Producto.findByPk(req.params.id, {
        include: { model: Categoria, as: 'categorias' },
      });

      res.json(productoActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar producto
  eliminarProducto: async (req, res) => {
    try {
      const producto = await Producto.findByPk(req.params.id);
      if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

      await producto.destroy();
      res.json({ mensaje: 'Producto eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
