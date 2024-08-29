
const express = require('express');

const cors = require('cors');

const usuarioRoutes  = require('./src/routes/rutaUsuario'); 
const categoriaRoutes= require('./src/routes/rutaCategoria');
const proveedorRoutes= require('./src/routes/rutaProveedor');
const productoRoutes= require('./src/routes/rutaProducto');
const solicitudRoutes = require('./src/routes/rutaSolicitud');
const ventaRoutes= require('./src/routes/rutaVenta')
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


// Rutas de API
app.use('/api/usuario', usuarioRoutes);
app.use('/api/categoria', categoriaRoutes);
app.use('/api/proveedor', proveedorRoutes);
app.use('/api/producto', productoRoutes);
app.use('/api/solicitud', solicitudRoutes);
app.use('/api/venta', ventaRoutes);


const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
