const { Order, Product, User } = require('../models');
const { sequelize } = require('../models');

const OrderController = {
  // 1. Crea un endpoint para ver los pedidos junto a los productos que tienen 
  async getOrdersWithProducts(req, res) {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: Product,
            through: {
              attributes: ['quantity', 'price']
            }
          },
          {
            model: User,
            attributes: ['user_id', 'name', 'email']
          }
        ]
      });

      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 2. Crea un endpoint para crear pedidos
  async addOrder(req, res) {
    const { user_id, productos } = req.body;
    // productos: [{ product_id: 1, quantity: 2, price: 10.50 }, ...]

    if (!user_id || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: "Datos incompletos." });
    }

    const total = productos.reduce((sum, p) => sum + p.quantity * p.price, 0);

    const transaction = await sequelize.transaction();
    try {
      const newOrder = await Order.create(
        { user_id, total },
        { transaction }
      );

      const orderProducts = productos.map(p => ({
        order_id: newOrder.order_id,
        product_id: p.product_id,
        quantity: p.quantity,
        price: p.price
      }));

      // Inserta en OrderProduct (tabla intermedia)
      await sequelize.models.OrderProduct.bulkCreate(orderProducts, { transaction });

      await transaction.commit();

      res.status(201).json({ message: "Pedido creado correctamente", order_id: newOrder.order_id });
    } catch (err) {
      await transaction.rollback();
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = OrderController;
