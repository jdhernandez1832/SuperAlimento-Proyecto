const express = require('express');
const router = express.Router();
const { Proveedor } = require('../models'); // Asegúrate de que la ruta y el modelo sean correctos

// Ruta para registrar un nuevo proveedor
router.post('/registrar', async (req, res) => {
  try {
    const nuevoProveedor = await Proveedor.create(req.body);
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar proveedor' });
  }
});

// Ruta para obtener todos los proveedores
router.get('/todos', async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    res.status(200).json(proveedores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener proveedores' });
  }
});

// Ruta para obtener un proveedor por su ID
router.get('/:id_proveedor', async (req, res) => {
  try {
    const proveedor = await Proveedor.findOne({ where: { id_proveedor: req.params.id_proveedor } });
    if (proveedor) {
      res.json(proveedor);
    } else {
      res.status(404).json({ message: 'Proveedor no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el proveedor' });
  }
});

// Ruta para actualizar un proveedor por su ID
router.put('/actualizar/:id_proveedor', async (req, res) => {
  try {
    const { id_proveedor } = req.params;
    const [actualizado] = await Proveedor.update(req.body, {
      where: { id_proveedor }
    });

    if (actualizado) {
      const proveedorActualizado = await Proveedor.findOne({ where: { id_proveedor } });
      res.status(200).json(proveedorActualizado);
    } else {
      res.status(404).json({ message: 'Proveedor no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el proveedor' });
  }
});

// Ruta para cambiar de estado a un proveedor por su ID
router.patch('/estado/:id_proveedor', async (req, res) => {
  try {
    const { estado } = req.body; // El estado debe ser 'Activo' o 'Desactivo'
    const [actualizado] = await Proveedor.update({ estado }, {
      where: { id_proveedor: req.params.id_proveedor }
    });

    if (actualizado) {
      const proveedorActualizado = await Proveedor.findOne({
        where: { id_proveedor: req.params.id_proveedor }
      });
      res.json(proveedorActualizado);
    } else {
      res.status(404).json({ message: 'Proveedor no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el estado del proveedor' });
  }
});

module.exports = router;


