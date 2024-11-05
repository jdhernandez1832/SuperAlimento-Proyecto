const express = require('express');
const router = express.Router();
const { Venta, Detalle_Venta, sequelize, FechaVencimiento } = require('../models');
const { Op } = require('sequelize'); 
// Ruta para registrar una venta
router.post('/registrar', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { fecha_venta, metodo_pago, caja, numero_documento, productos } = req.body;


    const productosConVencimiento = await FechaVencimiento.findAll({
      where: {
        id_producto: productos.map(p => p.id_producto),
        cantidad: { [Op.gt]: 0 } 
      },
      order: [['fecha_vencimiento', 'ASC']], 
      limit: productos.length 
    });

    if (productosConVencimiento.length < productos.length) {
      return res.status(400).json({ message: 'No hay suficientes productos disponibles' });
    }


    const nuevaVenta = await Venta.create({
      fecha_venta,
      metodo_pago,
      caja,
      total_venta: productos.reduce((total, item) => total + item.precio * item.cantidad, 0),
      numero_documento,
    }, { transaction });


    const detallesVenta = [];
    for (const producto of productosConVencimiento) {

      const cantidadDisponible = producto.cantidad; 
      const cantidadAVender = Math.min(cantidadDisponible, productos.find(p => p.id_producto === producto.id_producto).cantidad); 

      detallesVenta.push({
        id_producto: producto.id_producto,
        id_venta: nuevaVenta.id_venta,
        cantidad: cantidadAVender,
        precio_total: producto.precio * cantidadAVender 
      });

      producto.cantidad -= cantidadAVender; 
      await producto.save({ transaction });
    }

    await Detalle_Venta.bulkCreate(detallesVenta, { transaction });

    await transaction.commit();
    res.status(201).json(nuevaVenta);
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al registrar la venta' });
  }
});

// Ruta para obtener todas las ventas
router.get('/todos', async (req, res) => {
  try {
    const ventas = await Venta.findAll();
    res.status(200).json(ventas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
});

// Ruta para obtener detalles de una venta
router.get('/detalles/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const venta = await Venta.findByPk(id);
    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    const productos = await Detalle_Venta.findAll({ where: { id_venta: id } });

    res.json({ venta, productos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los detalles de la venta' });
  }
});




router.get('/semana', async (req, res) => {
  try {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const formattedToday = today.toISOString().split('T')[0];
    const formattedLastWeek = lastWeek.toISOString().split('T')[0];

    // Consulta simplificada
    const ventas = await Venta.findAll({
      where: {
        fecha_venta: {
          [Op.between]: [formattedLastWeek, formattedToday]
        }
      },
      attributes: ['fecha_venta', 'total_venta'],
      order: [['fecha_venta', 'ASC']]
    });

    // Log de ventas para verificar datos
    console.log('Ventas:', ventas);

    const result = {
      dates: ventas.map(v => v.fecha_venta || 'Sin Fecha'),
      sales: ventas.map(v => parseFloat(v.total_venta) || 0)
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching weekly sales:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
