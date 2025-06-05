const { Product, Category } = require('../models');
const { sequelize } = require('../models');


const productController  = {
//Obtener producto por ID con categorias
 async obtenerProductoPorId(req, res) {
    try {
      const producto = await Product.findByPk(req.params.id, {
        include: {
          model: Category,
          through: { attributes: [] }
        }
      });

      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json(producto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear la tabla Product usando SQL (opcional si usas Sequelize sync)
  async crearTablaProductos(req, res) {
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

  // Crear producto
  async crearProducto(req, res) {
    const { name, description, price, stock, categories } = req.body;

    if (!name || !price || !stock || !categories || !Array.isArray(categories)) {
      return res.status(400).json({ error: 'Faltan campos o categories no es un array' });
    }

    try {
      const producto = await Product.create({ name, description, price, stock });
      await producto.setCategories(categories);

      const productoConCategorias = await Product.findByPk(producto.product_id, {
        include: { model: Category, through: { attributes: [] } }
      });

      res.status(201).json(productoConCategorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar producto
  async actualizarProducto(req, res) {
    const { name, description, price, stock, categories } = req.body;

    try {
      const producto = await Product.findByPk(req.params.id);

      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      await producto.update({ name, description, price, stock });

      if (categories && Array.isArray(categories)) {
        await producto.setCategories(categories);
      }

      const productoActualizado = await Product.findByPk(req.params.id, {
        include: { model: Category, through: { attributes: [] } }
      });

      res.json(productoActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar producto
  async eliminarProducto(req, res) {
    try {
      const producto = await Product.findByPk(req.params.id);

      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      await producto.destroy();
      res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener todos los productos con sus categorías
  async obtenerProductos(req, res) {
    try {
      const productos = await Product.findAll({
        include: {
          model: Category,
          through: { attributes: [] }
        }
      });

      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = productController;





