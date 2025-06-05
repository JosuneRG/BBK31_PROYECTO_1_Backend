const jwt = require('jsonwebtoken'); 
const JWT_SECRET = 'tu_secreta_segura';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'Token requerido' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    req.userId = payload.userId;
    next();
  });
}

module.exports = authMiddleware;
