const db = require('../config/database');

const OrderController = {

    // Creamos la tabla pedidos 
    createOrderTable: (req, res) => {
      const sql = `CREATE TABLE Order (
        idOrder INT AUTO_INCREMENT PRIMARY KEY,
        idUser INT NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total DECIMAL(10, 2),
        FOREIGN KEY (idUser) REFERENCES User (idUser)
      )`;
      db.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Tabla de pedidos creada.");
      });
    },
    
    //Creamos la tabla intermedia entre los pedidos y productos
    createOrderProductTable: (req, res) => {
      const sql = `CREATE TABLE OrderProduct (
        idOrder INT NOT NULL,
        idProduct INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        PRIMARY KEY (idOrder, idProduct),
        FOREIGN KEY (idOrder) REFERENCES Order (idOrder) ON DELETE CASCADE,
        FOREIGN KEY (idProduct) REFERENCES Product(idProduct) ON DELETE CASCADE
      )`;
      db.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Tabla OrderProduct creada.");
      });
    },

    //1 - Crea un endpoint para ver los pedidos junto a los productos que tienen 
    getOrdersWithProducts: (req, res) => {
        const sql = `SELECT o.idOrder, o.order_date, o.total,
                          p.idProduct, p.name AS productName, op.quantity, op.price
                      FROM Order o
                      
                      JOIN OrderProduct op 
                      ON o.idOrder = op.idOrder
                      
                      JOIN Product p 
                      ON op.idProduct = p.idProduct
                  `;
        db.query(sql, (err, results) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(results);
        });
    },

    //2 - Crea un endpoint para crear pedidos
    addOrder: (req, res) => {
      const { idUser, productos } = req.body;
      // productos: [{ idProduct: 1, quantity: 2, price: 10.50 }, ...]

      if (!idUser || !productos || !productos.length) {
        return res.status(400).json({ error: "Datos incompletos." });
      }

      const total = productos.reduce((sum, item) => sum + item.quantity * item.price, 0);

      const orderSql = "INSERT INTO `Order` (idUser, total) VALUES (?, ?)";
      
      db.query(orderSql, [idUser, total], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const orderId = result.insertId;

        const values = productos.map(p => [orderId, p.idProduct, p.quantity, p.price]);

        const orderProductSql = `INSERT INTO OrderProduct (idOrder, idProduct, quantity, price) VALUES ?`;

        db.query(orderProductSql, [values], (err2) => {
          
          if (err2) return res.status(500).json({ error: err2.message });
            res.status(201).json({ mensaje: "Pedido creado", idOrder: orderId });
        });
      });
    }

}

// Exportamos el controlador para que pueda usarse en las rutas
module.exports = OrderController;