console.log("Iniciando servidor...");

const express = require("express");
const app = express();
const port = 3000;

//Se usa para que el servidor entienda JSON en las peticiones
app.use(express.json());

//Para importar las rutas
const productRoutes = require('./routes/product');  // <-- aquí importas tus rutas de productos
app.use('/api/productos', productRoutes); // <-- aquí dices que esas rutas respondan bajo /api/productos

app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
