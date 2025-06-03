function validateProduct(req, res, next) {
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }
  next();
}

module.exports = validateProduct;
