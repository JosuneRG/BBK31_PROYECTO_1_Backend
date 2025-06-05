console.log("Iniciando servidor...");
require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use('/auth', require('./middleware/authenticateToken'));
app.use('/productos', require('./routes/product'));
app.use('/users', require('./routes/user'));         
app.use('/categories', require('./routes/category'));
app.use('/pedidos', require('./routes/order'));

// Revisa estas rutas
console.log('Category route:', require('./routes/category'));
console.log('Product route:', require('./routes/product'));
console.log('Order route:', require('./routes/order'));
console.log('User route:', require('./routes/user'));


// Ruta raíz
app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

// Middleware para errores 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Levantar servidor
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
