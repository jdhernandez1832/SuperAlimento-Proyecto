// backend/routes/categoriaRoutes.js
const express = require('express');
const router = express.Router();
const {Categoria} = require('../models'); // Ajusta la ruta según la estructura de tu proyecto


// Crear categoría
router.post('/registrar', async (req, res) => {
    try {
      const nuevaCategoria = await Categoria.create({
        nombre: req.body.nombre,
        estado: req.body.estado || 'Activo' // Proporciona un valor predeterminado si no se proporciona
      });
      res.status(201).json(nuevaCategoria);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar categoría' });
    }
  });
// Ruta para obtener todas las categorías
router.get('/todos', async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.status(200).json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
});

// Ruta para obtener una categoría por su ID
router.get('/:id_categoria', async (req, res) => {
  try {
    const categoria = await Categoria.findOne({ where: { id_categoria: req.params.id_categoria } });
    if (categoria) {
      res.json(categoria);
    } else {
      res.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la categoría' });
  }
});

// Ruta para actualizar una categoría por su ID
router.put('/actualizar/:id_categoria', async (req, res) => {
  try {
    const { id_categoria } = req.params;
    const [actualizado] = await Categoria.update(req.body, {
      where: { id_categoria }
    });

    if (actualizado) {
      const categoriaActualizada = await Categoria.findOne({ where: { id_categoria } });
      res.status(200).json(categoriaActualizada);
    } else {
      res.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la categoría' });
  }
});

// Ruta para cambiar de estado una categoría por su ID
router.patch('/estado/:id_categoria', async (req, res) => {
  try {
    const { estado } = req.body; // El estado debe ser 'Activo' o 'Desactivo'
    const [actualizado] = await Categoria.update({ estado }, {
      where: { id_categoria: req.params.id_categoria }
    });

    if (actualizado) {
      const categoriaActualizado = await Categoria.findOne({
        where: { id_categoria: req.params.id_categoria }
      });
      res.json(categoriaActualizado);
    } else {
      res.status(404).json({ message: 'Categoria no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el estado de la categoria' });
  }
});
module.exports = router;
