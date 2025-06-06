const { product, category } = require('../models');
const { sequelize } = require('../models');
const { Op } = require("sequelize");
const { Product, Category, Review, User } = require('../models');

const obtenerProductos = async (req, res) => {
  try {
    const productos = await Product.findAll({
      include: [
        { model: Category },
        {
          model: Review,
          include: [{ model: User, attributes: ['name', 'email'] }]
        }
      ]
    });
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        {
          model: Review,
          include: [{ model: User, attributes: ['name', 'email'] }]
        }
      ]
    });

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const productController = {
  //Obtener producto por ID con categorias
  obtenerProductoPorId: async (req, res) => {
    try {
      const product = await product.findByPk(req.params.id, {
        include: {
          model: Category,
          as: 'category',
          through: { attributes: [] }
        }
      });

      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json(product);
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
    const { name, description, price, categories } = req.body;

    // Improved validation
    if (
      !name || typeof name !== 'string' || name.trim() === '' ||
      !description || typeof description !== 'string' || description.trim() === '' ||
      !price || isNaN(price) ||
      !categories || !Array.isArray(categories) || categories.length === 0
    ) {
      return res.status(400).json({
        error: 'Error: All fields are required: name (string), description (string), price (number), categories (non-empty array).'
      });
    }

    try {
      const product = await Product.create({ name, description, price });
      await product.setCategories(categories);

      const productWithCategories = await Product.findByPk(product.id, {
        include: { model: Category, as: 'categories' },
      });

      res.status(201).json(productWithCategories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 2.Endpoint para actualizar un producto
  actualizarProducto: async (req, res) => {
    const { name, description, price, categories } = req.body;

    try {
      // Find the product by ID
      const product = await Product.findByPk(req.params.id);

      // Validate existence
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Update basic fields
      await product.update({ name, description, price });

      // Update categories if provided
      if (categories && Array.isArray(categories)) {
        await product.setCategories(categories); // Updates many-to-many relationship
      }

      // Fetch updated product with categories
      const updatedProduct = await Product.findByPk(req.params.id, {
        include: { model: Category, as: 'categories' },
      });

      // Respond with updated product
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  //3.Endpoint para eliminar un producto
  eliminarProducto: async (req, res) => {
    try {
      // Find the product by ID
      const product = await Product.findByPk(req.params.id);

      // Validate existence
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Delete the product (and its associations if defined with ON DELETE CASCADE)
      await product.destroy();

      // Respond to client
      res.json({ message: 'Product successfully deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //4. Endpoint de traer productos debe mostrarse junto a la categoría o categorías que pertenece
  obtenerProductos: async (req, res) => {
    try {
      // Fetch all products including their related categories
      const products = await Product.findAll({
        include: {
          model: Category,
          as: 'categories', // name of the association in your model
          through: { attributes: [] } // optional: exclude join table data from response
        }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //5. Filtro para buscar producto por nombreEndpoint que traiga un producto por su id  // GET /productos?nombre=xxx
  buscarPorNombre: async (req, res) => {
    try {
      const name = req.query.name;

      if (!name) {
        return res.status(400).json({ message: "Missing 'name' query parameter" });
      }

      const products = await Product.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`
          }
        },
        include: {
          model: Category,
          as: 'categories',
          through: { attributes: [] }
        }
      });

      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error searching products", error });
    }
  },

  // GET /productos/:id
  obtenerProductoPorId: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: {
          model: Category,
          as: 'categories',
          through: { attributes: [] }
        }
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product", error });
    }
  },

  //6. Filtro para buscar producto por precio
  buscarPorPrecio: async (req, res) => {
    const { price, minPrice, maxPrice } = req.query;
    const where = {};

    if (price) {
      where.price = price;
    } else {
      if (minPrice) {
        where.price = { [Op.gte]: parseFloat(minPrice) };
      }

      if (maxPrice) {
        where.price = {
          ...(where.price || {}),
          [Op.lte]: parseFloat(maxPrice)
        };
      }
    }

    try {
      const products = await Product.findAll({
        where,
        include: {
          model: Category,
          as: 'categories',
          through: { attributes: [] }
        }
      });

      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error filtering products by price", error });
    }
  },

  //7. Filtro que ordene los productos de mayor a menor precio
  ordenarPorPrecioDesc: async (req, res) => {
    try {
      const products = await Product.findAll({
        order: [['price', 'DESC']],  // descending order by price
        include: {
          model: Category,
          as: 'categories',
          through: { attributes: [] }
        }
      });

      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving sorted products", error });
    }
  }
};  // <-- cierre final del objeto module.exports

module.exports = productController;