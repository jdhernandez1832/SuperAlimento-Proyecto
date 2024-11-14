require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2; // Importamos Cloudinary
const { verifyToken, permitRole } = require('./src/middlewares/middlewares'); 
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const usuarioRoutes = require('./src/routes/rutaUsuario');
const categoriaRoutes = require('./src/routes/rutaCategoria');
const proveedorRoutes = require('./src/routes/rutaProveedor');
const productoRoutes = require('./src/routes/rutaProducto');
const solicitudRoutes = require('./src/routes/rutaSolicitud');
const ventaRoutes = require('./src/routes/rutaVenta');
const loginRoutes = require('./src/routes/rutaLogin');
const olvidoRoutes = require('./src/routes/rutaOlvido');
const incidenciaRoutes = require('./src/routes/rutaIncidencia');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración de Multer para cargar las imágenes a Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'productos',  // Puedes cambiar el nombre de la carpeta donde se almacenarán las imágenes
    allowed_formats: ['jpg', 'jpeg', 'png'], // Formatos de imagen permitidos
  },
});

// Crear una instancia de Multer con el almacenamiento configurado
const upload = multer({ storage: storage });

// Ruta para subir la imagen
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No se ha subido ningún archivo' });
  }

  // Si todo está bien, responder con la URL de la imagen cargada en Cloudinary
  res.status(200).send({
    message: 'Imagen subida correctamente',
    imageUrl: req.file.path, // Cloudinary devuelve la URL pública del archivo subido
  });
});

app.use('/api/login', loginRoutes);
app.use('/api/olvido', olvidoRoutes);
app.use('/api/usuario', verifyToken, permitRole('Administrador', 'Inventarista', 'Cajero' ), usuarioRoutes);
app.use('/api/categoria', verifyToken, permitRole('Administrador', 'Inventarista', 'Cajero' ), categoriaRoutes);
app.use('/api/proveedor', verifyToken, permitRole('Administrador', 'Inventarista', 'Cajero' ), proveedorRoutes);
app.use('/api/producto', verifyToken, permitRole('Administrador', 'Inventarista', 'Cajero' ), productoRoutes);
app.use('/api/solicitud', verifyToken, permitRole('Administrador', 'Inventarista', 'Cajero' ), solicitudRoutes);
app.use('/api/venta', verifyToken, permitRole('Administrador', 'Inventarista', 'Cajero' ), ventaRoutes);
app.use('/api/incidencia', verifyToken, permitRole('Administrador', 'Inventarista', 'Cajero'), incidenciaRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
