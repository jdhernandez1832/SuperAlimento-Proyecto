// backend/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const { Usuario } = require('../models'); // Asegúrate de que la ruta y el modelo sean correctos



router.post('/registrar', async (req, res) => {
  try {
    const nuevoUsuario = await Usuario.create(req.body); // Crear el usuario en la base de datos
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

router.get('/todos', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll(); // Traer todos los usuarios de la base de datos
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Ruta para obtener un usuario por número de documento
router.get('/:numero_documento', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ where: { numero_documento: req.params.numero_documento } });
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
});
// Actualizar un usuario por su número de documento
router.put('/actualizar/:numero_documento', async (req, res) => {
  try {
    const { numero_documento } = req.params;
    const [updated] = await Usuario.update(req.body, {
      where: { numero_documento }
    });

    if (updated) {
      const updatedUsuario = await Usuario.findOne({ where: { numero_documento } });
      res.status(200).json(updatedUsuario);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

// backend/routes/usuarioRoutes.js
router.patch('/estado/:numero_documento', async (req, res) => {
  try {
    const { estado } = req.body; // El estado debe ser 'Activo' o 'Desactivo'
    const [actualizado] = await Usuario.update({ estado }, {
      where: { numero_documento: req.params.numero_documento }
    });

    if (actualizado) {
      const usuarioActualizado = await Usuario.findOne({
        where: { numero_documento: req.params.numero_documento }
      });
      res.json(usuarioActualizado);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el estado del usuario' });
  }
});

module.exports = router;
