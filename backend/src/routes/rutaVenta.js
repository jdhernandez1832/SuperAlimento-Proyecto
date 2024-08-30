const express = require('express');
const router = express.Router();
const { Venta, Detalle_Venta, sequelize } = require('../models');
const { Op } = require('sequelize'); 
// Ruta para registrar una venta
router.post('/registrar', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { fecha_venta, metodo_pago, caja, numero_documento, productos } = req.body;

    // Registrar la venta
    const nuevaVenta = await Venta.create({
      fecha_venta,
      metodo_pago,
      caja,
      total_venta: productos.reduce((total, item) => total + item.precio * item.cantidad, 0),
      numero_documento,
    }, { transaction });

    // Registrar los productos asociados a la venta
    const detallesVenta = productos.map(producto => ({
      id_producto: producto.id_producto,
      id_venta: nuevaVenta.id_venta,
      cantidad: producto.cantidad,
      precio_total: producto.precio * producto.cantidad
    }));

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
    const lastWeek = new Date(today.setDate(today.getDate() - 7));

    // Verifica las fechas generadas
    console.log('Fecha actual:', today);
    console.log('Fecha de hace una semana:', lastWeek);

    const ventas = await Venta.findAll({
      where: {
        fecha_venta: {
          [Op.between]: [lastWeek, new Date()]
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('fecha_venta')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_venta')), 'total']
      ],
      group: ['date'],
      order: [['date', 'ASC']]
    });

    // Log de ventas para verificar datos
    console.log('Ventas:', ventas);

    const result = {
      dates: ventas.map(v => v.dataValues.date || 'Sin Fecha'),
      sales: ventas.map(v => parseFloat(v.dataValues.total) || 0)
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching weekly sales:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


module.exports = router;
