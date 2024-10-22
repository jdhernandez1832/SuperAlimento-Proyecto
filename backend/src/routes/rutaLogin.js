const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const { Usuario, Rol } = require('../models'); 
const SECRET_KEY = 'superalimento';

router.post('/ingreso', async (req, res) => {
  const { numero_documento, clave } = req.body;

  try {
    const usuario = await Usuario.findOne({
      where: { numero_documento },
      include: [{ model: Rol, as: 'Rol' }]
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar el estado del usuario
    if (usuario.estado === 'Desactivo') {  // Cambio aquí
      return res.status(403).json({ message: 'Usuario desactivado' });
    }

    const esValidaClave = await bcrypt.compare(clave, usuario.clave);
    if (!esValidaClave) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        id: usuario.numero_documento,
        rol: usuario.Rol.nombre,
      },
      SECRET_KEY,
      { expiresIn: '12h' }
    );

    res.json({ 
      token, 
      rol: usuario.Rol.nombre, 
      numero_documento: usuario.numero_documento, 
      estado: usuario.estado 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al autenticar usuario' });
  }
});

module.exports = router;
