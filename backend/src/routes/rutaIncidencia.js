// backend/routes/IncidenciaRoutes.js
const express = require('express');
const router = express.Router();
const { Incidencia, Producto  } = require('../models');

// Crear Incidencia
// Crear Incidencias
router.post('/registrar', async (req, res) => {
    try {
      const incidencias = req.body; // Ahora es un array de incidencias
  
      // Validar que se reciban los datos necesarios
      for (const incidencia of incidencias) {
        const { descripcion_incidencia, cantidad_afectada, id_producto } = incidencia;
  
        if (!descripcion_incidencia || !cantidad_afectada || !id_producto) {
          return res.status(400).json({ message: 'Faltan datos requeridos.' });
        }
      }
  
      // Crear incidencias en la base de datos
      const nuevasIncidencias = await Incidencia.bulkCreate(incidencias); // Usar bulkCreate para múltiples registros
  
      return res.status(201).json(nuevasIncidencias);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al crear las incidencias.' });
    }
  });
  

// Consultar todas las incidencias

router.get('/todos', async (req, res) => {
  try {
    const incidencias = await Incidencia.findAll({
      include: [{ model: Producto, as: 'producto' }] // Usa el modelo directamente
    });

    return res.status(200).json(incidencias);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener las incidencias.' });
  }
});

module.exports = router;