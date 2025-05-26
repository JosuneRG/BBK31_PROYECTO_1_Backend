const express = require("express");
const app = express();
const port = 3000;
const mysql = require('mysql2');

app.use(express.json());

// Crear conexión SIN base de datos
const db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database: ''
});

// Conectar
db.connect((err) => {
  if (err) throw err;
  console.log('✅ Conectado a MySQL');
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});

