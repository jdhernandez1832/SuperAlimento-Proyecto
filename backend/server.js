const express = require('express');
const cors = require('cors');
const { verifyToken, permitRole } = require('./src/middlewares/middlewares'); // Importa los middlewares

const usuarioRoutes = require('./src/routes/rutaUsuario');
const categoriaRoutes = require('./src/routes/rutaCategoria');
const proveedorRoutes = require('./src/routes/rutaProveedor');
const productoRoutes = require('./src/routes/rutaProducto');
const solicitudRoutes = require('./src/routes/rutaSolicitud');
const ventaRoutes = require('./src/routes/rutaVenta');
const loginRoutes= require('./src/routes/rutaLogin');
const olvidoRoutes= require('./src/routes/rutaOlvido');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api/login', loginRoutes);
app.use('/api/olvido', olvidoRoutes);
app.use('/api/usuario', verifyToken, permitRole('Administrador', 'Inventarista', 'Cajero' ), usuarioRoutes);
app.use('/api/categoria', verifyToken, permitRole('Administrador', 'Inventarista', 'Cajero' ), categoriaRoutes);
app.use('/api/proveedor', verifyToken, permitRole('Administrador', 'Inventarista', 'Cajero' ), proveedorRoutes);
app.use('/api/producto', verifyToken, permitRole('Administrador', 'Inventarista', 'Cajero' ), productoRoutes);
app.use('/api/solicitud', verifyToken, permitRole('Administrador', 'Inventarista', 'Cajero' ), solicitudRoutes);
app.use('/api/venta', verifyToken, permitRole('Administrador', 'Inventarista', 'Cajero' ), ventaRoutes);


const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});