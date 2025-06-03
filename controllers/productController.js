const { Producto, Categoria } = require('../models');
const { sequelize } = require('../models');


module.exports = {
//Obtener producto por ID con categorias
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

// 1.Endpoint para crear producto 
  crearProducto: async (req, res) => {
    const { nombre, descripcion, precio, categorias } = req.body;

    if (!nombre || !descripcion || !precio || !categorias || !Array.isArray(categorias)) {
      return res.status(400).json({ error: 'Faltan campos o categorias no es un array' });
    }

    try {
      //Crear el producto
      const producto = await Producto.create({ nombre, descripcion, precio });

      // Asociar categorías (muchos a muchos)
      await producto.setCategorias(categorias);

      // Obtener el producto con categorías para respuesta
      const productoConCategorias = await Producto.findByPk(producto.id, {
        include: { model: Categoria, as: 'categorias' },
      });
      //Respuesta del cliente
      res.status(201).json(productoConCategorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

// 2.Endpoint para actualizar un producto
actualizarProducto: async (req, res) => {
  const { nombre, descripcion, precio, categorias } = req.body;

  try {
    //Buscar el producto por su ID
    const producto = await Producto.findByPk(req.params.id);

    //Validar existencia
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    //Actualizar campos básicos
    await producto.update({ nombre, descripcion, precio });

    //Actualizar categorías si se enviaron
    if (categorias && Array.isArray(categorias)) {
      await producto.setCategorias(categorias); // Actualiza relación muchos a muchos
    }

    // Obtener el producto actualizado con sus categorías
    const productoActualizado = await Producto.findByPk(req.params.id, {
      include: { model: Categoria, as: 'categorias' },
    });

    //Responder con el producto actualizado
    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

//3.Endpoint para eliminar un producto
  eliminarProducto: async (req, res) => {
  try {
    //Buscar el producto por ID
    const producto = await Producto.findByPk(req.params.id);

    //Validar si existe
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    //Eliminar el producto (y sus asociaciones si están definidas con ON DELETE CASCADE)
    await producto.destroy();

    //Responder al cliente
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},  

//4. Endpoint de traer productos debe mostrarse junto a la categoría o categorías que pertenece
obtenerProductos: async (req, res) => {
  try {
    // Traer todos los productos incluyendo sus categorías relacionadas
    const productos = await Producto.findAll({
      include: {
        model: Categoria,
        as: 'categorias', // nombre de la relación en tu modelo
        through: { attributes: [] } // opcional: para no mostrar tabla intermedia en la respuesta
      }
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
};





