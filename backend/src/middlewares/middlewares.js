// src/middlewares/middlewares.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'superalimento';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const rol = req.headers['x-rol'];

  console.log('Token recibido en servidor:', token); 
  console.log('Rol recibido en servidor:', rol);


  if (!token) return res.status(403).json({ message: 'Token no proporcionado' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    req.user = user;
    req.rol = rol; 
    next();
  });
};

const permitRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.rol)) {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  next();
};



module.exports = { verifyToken, permitRole };
