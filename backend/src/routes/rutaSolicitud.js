const express = require('express');
const router = express.Router();
const { Solicitud, Solicitud_Producto, sequelize } = require('../models');

router.post('/registrar', async (req, res) => {
  const transaction = await sequelize.transaction(); 

  try {
    const { fecha_entrada, estado_solicitud, precio_total, observacion, numero_documento, id_proveedor, productos } = req.body;

    // Registrar la solicitud
    const nuevaSolicitud = await Solicitud.create({
      fecha_entrada,
      estado_solicitud,
      precio_total,
      observacion,
      numero_documento,
      id_proveedor
    }, { transaction });

    // Registrar los productos asociados a la solicitud
    const productosData = productos.map(prod => ({
      id_solicitud: nuevaSolicitud.id_solicitud,
      id_producto: prod.id_producto,
      cantidad: prod.cantidad // Se guarda la cantidad proporcionada por el usuario
    }));
    
    await Solicitud_Producto.bulkCreate(productosData, { transaction });

    await transaction.commit();
    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al registrar la solicitud' });
  }
});

router.get('/todos', async (req, res) => {
  try {
      const solicitudes = await Solicitud.findAll(); // Traer todas las solicitudes de la base de datos
      res.status(200).json(solicitudes);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener solicitudes' });
  }
});

// Ruta para obtener detalles de una solicitud
router.get('/detalles/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) {
          return res.status(404).json({ message: 'Solicitud no encontrada' });
      }

      const productos = await Solicitud_Producto.findAll({ where: { id_solicitud: id } });

      res.json({ solicitud, productos });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los detalles de la solicitud' });
  }
});

router.post('/aceptar-entrega/:id', async (req, res) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();

  try {
    // Encuentra la solicitud
    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Actualiza el estado de la solicitud
    solicitud.estado_solicitud = 'Aprobada';
    await solicitud.save({ transaction });

    await transaction.commit();
    res.status(200).json({ message: 'Solicitud aceptada y productos agregados' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});

module.exports = router;

