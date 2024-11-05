// backend/routes/IncidenciaRoutes.js
const express = require('express');
const router = express.Router();
const { Incidencia, FechaVencimiento, Producto } = require('../models');
const Sequelize = require('sequelize');

// Crear Incidencias y actualizar inventario por fecha de vencimiento
router.post('/registrar', async (req, res) => {
    try {
        const incidencias = req.body; // Supone que recibes un array de incidencias

        // Validar que cada incidencia contenga la fecha de vencimiento y el producto
        for (const incidencia of incidencias) {
            const { descripcion_incidencia, cantidad_afectada, id_producto, id_fecha_vencimiento } = incidencia;

            if (!descripcion_incidencia || !cantidad_afectada || !id_producto || !id_fecha_vencimiento) {
                return res.status(400).json({ message: 'Faltan datos requeridos.' });
            }
        }

        // Crear las incidencias en la base de datos
        const nuevasIncidencias = await Incidencia.bulkCreate(incidencias);

        // Actualizar la cantidad en `fechas_vencimiento` para cada incidencia
        for (const incidencia of incidencias) {
            const { cantidad_afectada, id_fecha_vencimiento } = incidencia;

            // Actualizar la cantidad específica de la fecha de vencimiento seleccionada
            await FechaVencimiento.update(
              { cantidad: Sequelize.literal(`cantidad - ${cantidad_afectada}`) },
              { where: { id: id_fecha_vencimiento } }
          );          
        }

        return res.status(201).json(nuevasIncidencias);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear las incidencias y actualizar inventario.' });
    }
});

// Consultar todas las incidencias
router.get('/todos', async (req, res) => {
    try {
        const incidencias = await Incidencia.findAll({
            include: [{ model: Producto, as: 'producto' }]
        });

        return res.status(200).json(incidencias);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener las incidencias.' });
    }
});

module.exports = router;
