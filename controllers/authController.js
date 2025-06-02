const { User } = require('../models'); // ajusta la ruta si es necesario
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({ message: 'Email y password son requeridos' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET || 'tu_clave_secreta',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);

    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { login };
