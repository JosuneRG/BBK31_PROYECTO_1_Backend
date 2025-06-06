const { Review, User } = require('../models');

const crearReview = async (req, res) => {
  try {
    const { content, rating, product_id } = req.body;
    const user_id = req.user.user_id; // del token
    const nuevaReview = await Review.create({ content, rating, product_id, user_id });
    res.status(201).json(nuevaReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const obtenerReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }]
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Agrega updateReview, deleteReview, getReviewById si necesitas

module.exports = {
  crearReview,
  obtenerReviews
};
