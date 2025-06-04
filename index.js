console.log("Iniciando servidor...");

const express = require("express");
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/auth');            // Rutas de login/register (usuarios)
const productRoutes = require('./routes/product');      // Rutas de productos
const userRoutes = require('./routes/user');            // (Si tienes más rutas de usuario separadas)
const categoryRoutes = require('./routes/category');    // (Si manejas categorías)
const orderRoutes = require('./routes/order');  

// Usar las rutas con sus prefijos
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/users', userRoutes);         
app.use('/api/categorias', categoryRoutes); 
app.use('/api/pedidos', orderRoutes);   

app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
