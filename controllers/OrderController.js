const db = require('../config/database');

const OrderController = {

    /// 4. Crear tabla Order
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
    
    createOrderProductTable: (req, res) => {
      const sql = `CREATE TABLE OrderProduct (
        idOrder INT NOT NULL,
        idProdruct INT NOT NULL,
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

    // Agrega pedidos a la tabla
    addOrder: (req, res) => {
      const { nameCategory } = req.body;
      const sql = "INSERT INTO order (nameCategory) VALUES (?)";
      db.query(sql, [nameCategory], (err, result) => {
        if (err) throw err;
        res.send("Pedido añadida correctamente");
      });
    },
}

// Exportamos el controlador para que pueda usarse en las rutas
module.exports = OrderController;