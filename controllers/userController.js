const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Order, Product } = require('../models');

// Usa variable de entorno o fija una de desarrollo
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreta_segura';

const userController = {
  // 1. REGISTRO DE USUARIO
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validar campos requeridos
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
      }

      // Verificar si el email ya existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
      }

      // Encriptar contraseña y crear usuario
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ name, email, password: hashedPassword });

      return res.status(201).json({
        message: 'Usuario registrado correctamente',
        userId: newUser.user_id
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al registrar usuario' });
    }
  },

  // 2. LOGIN DE USUARIO
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ message: 'Login exitoso', token });

    } catch (error) {
      return res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  },

  // 3. PERFIL DE USUARIO LOGUEADO
  async getProfile(req, res) {
    try {
      const userId = req.userId;

      const user = await User.findByPk(userId, {
        attributes: ['user_id', 'name', 'email'],
        include: {
          model: Order,
          include: {
            model: Product,
            through: { attributes: ['quantity', 'price'] }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      return res.json(user);

    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener perfil de usuario' });
    }
  },

  // 4. LOGOUT SIMBÓLICO (JWT no se puede invalidar desde el backend directamente)
  logout(req, res) {
    // Puedes usar cookies para destruir sesión si implementas sesión en vez de token
    return res.json({ message: 'Logout exitoso. Borra el token en el cliente.' });
  }
};

module.exports = userController;
