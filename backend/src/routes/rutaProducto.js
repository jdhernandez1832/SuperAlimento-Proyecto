const express = require('express');
const router = express.Router();
const { Producto, FechaVencimiento, Usuario, Rol   } = require('../models'); // Ajusta la ruta según la estructura de tu proyecto
const multer = require('multer');
const moment = require('moment');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

// Configuración de multer para almacenar imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Crear producto con imagen
router.post('/registrar', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre_producto, codigo_barras, precio_compra, precio_venta, descripcion_producto, estado, id_categoria, numero_documento, id_proveedor } = req.body;
        const imagen = req.file ? req.file.filename : null;

        const nuevoProducto = await Producto.create({
            nombre_producto,
            codigo_barras,
            precio_compra,
            precio_venta,
            descripcion_producto,
            estado,
            id_categoria,
            numero_documento,
            id_proveedor,
            imagen // Guardamos el nombre del archivo en la base de datos
        });

        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar producto' });
    }
});

// Obtener todos los productos
router.get('/todos', async (req, res) => {
    try {
        const productos = await Producto.findAll(); // Traer todos los productos de la base de datos
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
});

// Obtener un producto por ID
router.get('/:id_producto', async (req, res) => {
    try {
        const producto = await Producto.findOne({ where: { id_producto: req.params.id_producto } });
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
});

// Actualizar un producto por ID
router.put('/actualizar/:id_producto', upload.single('imagen'), async (req, res) => {
    try {
        const { id_producto } = req.params;
        const { nombre_producto, codigo_barras, precio_compra, precio_venta, descripcion_producto, estado, id_categoria, numero_documento, id_proveedor } = req.body;
        const imagen = req.file ? req.file.filename : null;

        const producto = await Producto.findOne({ where: { id_producto } });

        if (producto) {
            await producto.update({
                nombre_producto,
                codigo_barras,
                precio_compra,
                precio_venta,
                descripcion_producto,
                estado,
                id_categoria,
                numero_documento,
                id_proveedor,
                imagen: imagen || producto.imagen // Si no se sube nueva imagen, se mantiene la existente
            });
            res.status(200).json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
});

// Actualizar el estado de un producto por ID
router.patch('/estado/:id_producto', async (req, res) => {
    try {
        const { estado } = req.body; // El estado debe ser 'Activo' o 'Desactivo'
        const [actualizado] = await Producto.update({ estado }, {
            where: { id_producto: req.params.id_producto }
        });

        if (actualizado) {
            const productoActualizado = await Producto.findOne({
                where: { id_producto: req.params.id_producto }
            });
            res.json(productoActualizado);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el estado del producto' });
    }
});

// Obtener productos por proveedor
router.get('/por-proveedor/:id_proveedor', async (req, res) => {
    try {
        const { id_proveedor } = req.params;
        const productos = await Producto.findAll({ where: { id_proveedor } });
        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener productos del proveedor:", error);
        res.status(500).json({ message: 'Error al obtener productos del proveedor' });
    }
});
// Obtener cantidad de un producto por ID
router.get('/cantidad/:id_producto', async (req, res) => {
    try {
        const { id_producto } = req.params;

        // Suponiendo que tienes un modelo llamado 'FechaVencimiento'
        const fechas = await FechaVencimiento.findAll({ where: { id_producto } });

        // Calcular la cantidad total de productos de acuerdo a las fechas
        const cantidadTotal = fechas.reduce((total, fecha) => total + fecha.cantidad, 0);

        res.status(200).json({ cantidad: cantidadTotal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la cantidad de productos' });
    }
});

router.get('/fechas-vencimiento/:id_producto', async (req, res) => {
    try {
        const { id_producto } = req.params;

        // Consultar todas las fechas de vencimiento y cantidades de acuerdo al id_producto
        const fechas = await FechaVencimiento.findAll({
            where: { id_producto },
            attributes: ['id', 'fecha_vencimiento', 'cantidad', 'lote'] // Agrega 'id' aquí
        });
        console.log(fechas);

        res.status(200).json(fechas);
    } catch (error) {
        console.error('Error al obtener fechas de vencimiento:', error);
        res.status(500).json({ message: 'Error al obtener fechas de vencimiento' });
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'supermercadosuperalimento@gmail.com', 
      pass: 'qygg xrdr qfpd qzit', 
    },
});


async function verificarFechasVencimiento() {
    try {
        const diasAviso = 2; // Número de días antes de la fecha de vencimiento para enviar el correo
        const diasVencimientoExcedido = 2; // Número de días después de la fecha de vencimiento para no enviar el correo
        const fechaActual = moment();

        const productos = await FechaVencimiento.findAll({
            attributes: ['id', 'id_producto', 'fecha_vencimiento', 'cantidad', 'lote'],
            include: {
                model: Producto,
                as: 'producto',  // Aquí usamos el alias 'producto'
                attributes: ['nombre_producto'],
            },
        });


        for (const fechaVencimiento of productos) {
            const producto = fechaVencimiento.producto;  // Accede correctamente al alias 'producto'
            const fechaVencimientoFecha = moment(fechaVencimiento.fecha_vencimiento);
            const cantidad = fechaVencimiento.cantidad;

            // Verifica que la cantidad sea mayor a 0
            if (cantidad <= 0) {
                console.log(`El producto ${producto.nombre_producto} con lote ${fechaVencimiento.lote} tiene cantidad 0, no se enviará correo.`);
                continue; // Si la cantidad es 0 o menor, no se envía correo
            }

            // Verifica si la fecha de vencimiento está próxima (dentro de los 'diasAviso')
            if (fechaVencimientoFecha.diff(fechaActual, 'days') <= diasAviso && fechaVencimientoFecha.isAfter(fechaActual)) {
                // Si está dentro del rango de aviso y no ha pasado la fecha de vencimiento
                await enviarCorreoNotificacion(fechaVencimiento);
            }

            // Verifica si el producto ya está vencido, pero solo si han pasado más de 2 días
            if (fechaVencimientoFecha.isBefore(fechaActual) && fechaActual.diff(fechaVencimientoFecha, 'days') <= diasVencimientoExcedido) {
                // Si han pasado 2 días o menos desde la fecha de vencimiento
                await enviarCorreoNotificacion(fechaVencimiento);
            }

        }

        console.log('Verificación de fechas de vencimiento completada');
    } catch (error) {
        console.error('Error al verificar fechas de vencimiento:', error);
    }
}

async function enviarCorreoNotificacion(fechaVencimiento) {
    const producto = fechaVencimiento.producto ? fechaVencimiento.producto.dataValues : null;

    if (!producto) {
        console.error('Producto no encontrado');
        return;
    }

    const usuarios = await Usuario.findAll({
        include: {
            model: Rol,
            as: 'Rol',
            attributes: ['nombre'] // Filtra por los roles
        },
        where: {
            '$Rol.nombre$': { [Op.in]: ['Administrador', 'Inventarista'] } // Filtrando por los roles
        }
    });

    const correos = usuarios.map((usuario) => usuario.correo_usuario);
    moment.locale('es');
    const fechaVencimientoFecha = moment(fechaVencimiento.fecha_vencimiento);
    const fechaActual = moment();
    
    // Determinar si el producto ya venció
    const productoVencido = fechaVencimientoFecha.isBefore(fechaActual);

    let subject, htmlContent;

    if (productoVencido) {
        // Si el producto está vencido
        subject = `¡Producto Vencido! ${producto.nombre_producto} - Lote ${fechaVencimiento.lote}`;
        htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #FF6347;">SuperAlimento</h1>
                    <p style="color: #F44336; font-size: 18px;">¡Alerta! Un producto ha vencido.</p>
                </div>
                <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #F44336;">Producto: ${producto.nombre_producto}</h2>
                    <p><strong>Lote:</strong> ${fechaVencimiento.lote}</p>
                    <p><strong>Fecha de vencimiento:</strong> ${fechaVencimientoFecha.format('dddd, D [de] MMMM [de] YYYY')}</p>
                    <p style="font-size: 16px; color: #555;">El producto ${producto.nombre_producto} con lote ${fechaVencimiento.lote} ha vencido el ${fechaVencimientoFecha.format('dddd, D [de] MMMM [de] YYYY')}. Por favor, tome las acciones necesarias de inmediato.</p>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <p style="color: #777;">Gracias por ser parte de <strong>SuperAlimento</strong>.</p>
                </div>
            </div>
        `;
    } else {
        // Si el producto está por vencer
        subject = `Producto a punto de vencer: ${producto.nombre_producto}`;
        htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #FF6347;">SuperAlimento</h1>
                    <p style="color: #4CAF50; font-size: 18px;">¡Atención! Un producto está próximo a vencer.</p>
                </div>
                <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #FF6347;">Producto: ${producto.nombre_producto}</h2>
                    <p><strong>Lote:</strong> ${fechaVencimiento.lote}</p>
                    <p><strong>Fecha de vencimiento:</strong> ${fechaVencimientoFecha.format('dddd, D [de] MMMM [de] YYYY')}</p>
                    <p style="font-size: 16px; color: #555;">El producto ${producto.nombre_producto} con lote ${fechaVencimiento.lote} está próximo a vencer el ${fechaVencimientoFecha.format('dddd, D [de] MMMM [de] YYYY')}. Por favor, toma las medidas necesarias para evitar inconvenientes.</p>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <p style="color: #777;">Gracias por ser parte de <strong>SuperAlimento</strong>.</p>
                </div>
            </div>
        `;
    }

    const mailOptions = {
        from: 'supermercadosuperalimento@gmail.com',
        to: correos,
        subject: subject, // Asunto que cambia dependiendo si el producto está vencido o no
        html: htmlContent, // Contenido del correo con el diseño correspondiente
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado a administradores e inventaristas');
    } catch (error) {
        console.error('Error al enviar correo:', error);
    }
}

// Ejecutar la función a las 5:00 PM todos los días
cron.schedule('0 17 * * *', verificarFechasVencimiento);

module.exports = router;
