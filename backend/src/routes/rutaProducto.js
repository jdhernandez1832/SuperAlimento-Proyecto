const express = require('express');
const router = express.Router();
const { Producto } = require('../models'); // Ajusta la ruta según la estructura de tu proyecto
const multer = require('multer');

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
        const { nombre_producto, codigo_barras, precio_compra, precio_venta, descripcion_producto, cantidad, estado, id_categoria, numero_documento, id_proveedor } = req.body;
        const imagen = req.file ? req.file.filename : null;

        const nuevoProducto = await Producto.create({
            nombre_producto,
            codigo_barras,
            precio_compra,
            precio_venta,
            descripcion_producto,
            cantidad,
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
        const { nombre_producto, codigo_barras, precio_compra, precio_venta, descripcion_producto, cantidad, estado, id_categoria, numero_documento, id_proveedor } = req.body;
        const imagen = req.file ? req.file.filename : null;

        const producto = await Producto.findOne({ where: { id_producto } });

        if (producto) {
            await producto.update({
                nombre_producto,
                codigo_barras,
                precio_compra,
                precio_venta,
                descripcion_producto,
                cantidad,
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

module.exports = router;
