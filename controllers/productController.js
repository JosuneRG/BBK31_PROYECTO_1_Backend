const { Producto, Categoria } = require('../models');
const { sequelize } = require('../models');
const { Op } = require("sequelize");

module.exports = {
  // Obtener producto por ID con categorias (solo una vez)
  obtenerProductoPorId: async (req, res) => {
    try {
      const producto = await Producto.findByPk(req.params.id, {
        include: {
          model: Categoria,
          as: 'categorias',
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

  // Crear la tabla product usando SQL
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

  // 1. Endpoint para crear producto 
  crearProducto: async (req, res) => {
    const { nombre, descripcion, precio, categorias } = req.body;

    if (
      !nombre || typeof nombre !== 'string' || nombre.trim() === '' ||
      !descripcion || typeof descripcion !== 'string' || descripcion.trim() === '' ||
      !precio || isNaN(precio) ||
      !categorias || !Array.isArray(categorias) || categorias.length === 0
    ) {
      return res.status(400).json({
        error: 'Error: Debe completar todos los campos: nombre (string), descripcion (string), precio (número), categorias (array no vacío).'
      });
    }

    try {
      const producto = await Producto.create({ nombre, descripcion, precio });
      await producto.setCategorias(categorias);

      const productoConCategorias = await Producto.findByPk(producto.id, {
        include: { model: Categoria, as: 'categorias' },
      });

      res.status(201).json(productoConCategorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 2. Endpoint para actualizar un producto
  actualizarProducto: async (req, res) => {
    const { nombre, descripcion, precio, categorias } = req.body;

    try {
      const producto = await Producto.findByPk(req.params.id);

      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

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

  // 3. Endpoint para eliminar un producto
  eliminarProducto: async (req, res) => {
    try {
      const producto = await Producto.findByPk(req.params.id);

      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      await producto.destroy();

      res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },  

  // 4. Endpoint para traer productos con sus categorías
  obtenerProductos: async (req, res) => {
    try {
      const productos = await Producto.findAll({
        include: {
          model: Categoria,
          as: 'categorias',
          through: { attributes: [] }
        }
      });
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 5. Filtro para buscar producto por nombre
  buscarPorNombre: async (req, res) => {
    try {
      const nombre = req.query.nombre;

      if (!nombre) {
        return res.status(400).json({ mensaje: "Falta el parámetro 'nombre'" });
      }

      const productos = await Producto.findAll({
        where: {
          nombre: {
            [Op.like]: `%${nombre}%`
          }
        },
        include: {
          model: Categoria,
          as: 'categorias',
          through: { attributes: [] }
        }
      });

      res.json(productos);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al buscar productos", error });
    }
  },

  // 6. Filtro para buscar producto por precio
  buscarPorPrecio: async (req, res) => {
    const { precio, minPrecio, maxPrecio } = req.query;
    const where = {};

    if (precio) {
      where.precio = precio;
    } else {
      if (minPrecio) {
        where.precio = { [Op.gte]: parseFloat(minPrecio) };
      }

      if (maxPrecio) {
        where.precio = {
          ...(where.precio || {}),
          [Op.lte]: parseFloat(maxPrecio)
        };
      }
    }

    try {
      const productos = await Producto.findAll({
        where,
        include: {
          model: Categoria,
          as: 'categorias',
          through: { attributes: [] }
        }
      });

      res.json(productos);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al filtrar productos por precio", error });
    }
  },

  // 7. Filtro que ordena productos de mayor a menor precio
  ordenarPorPrecioDesc: async (req, res) => {
    try {
      const productos = await Producto.findAll({
        order: [['precio', 'DESC']],
        include: {
          model: Categoria,
          as: 'categorias',
          through: { attributes: [] }
        }
      });

      res.json(productos);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener productos ordenados", error });
    }
  }
};
