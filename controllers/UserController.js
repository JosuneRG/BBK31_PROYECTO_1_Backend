const db = require('../config/database');

const CategoryController = {

    // 1. Crear tabla User
    createUserTable: (req, res) => {
    const sql = `CREATE TABLE User (
        idUser INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
    )`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Tabla de usuarios creada.");
    });
    },    

}