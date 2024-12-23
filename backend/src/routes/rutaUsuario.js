// backend/routes/usuarioRoutes.js
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const { Usuario,  Rol } = require('../models'); 

const nodemailer = require('nodemailer');  


router.post('/correo', async (req, res) => {
  const { email, clave, numero_documento } = req.body;


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'supermercadosuperalimento@gmail.com', 
      pass: 'qygg xrdr qfpd qzit', 
    },
  });

  const mailOptions = {
    from: 'supermercadosuperalimento@gmail.com',
    to: email,
    subject: 'Registro Exitoso - Su Contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 5px;">
        <h2 style="color: #333;">¡Registro Exitoso!</h2>
        <p style="color: #555;">
          Su registro fue exitoso. A continuación, encontrará su información de inicio de sesión:
        </p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ccc;">Usuario:</td>
            <td style="padding: 10px; border: 1px solid #ccc;">${numero_documento}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ccc;">Contraseña:</td>
            <td style="padding: 10px; border: 1px solid #ccc;">${clave}</td>
          </tr>
        </table>
        <p style="color: #555; margin-top: 20px;">
          Por favor, mantenga esta información en un lugar seguro y no la comparta con nadie.
        </p>
        <p style="color: #555;">¡Gracias por registrarse!</p>
        <footer style="margin-top: 30px; font-size: 0.8em; color: #777;">
          <p>Este es un correo automático, por favor no responda.</p>
          <p>Supermercado SuperAlimento</p>
        </footer>
      </div>
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar el correo: ', error);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
});

router.post('/registrar', async (req, res) => {
  try {
    const { clave, numero_documento, nombre_usuario, tipo_documento, id_rol, estado, correo_usuario, telefono_usuario } = req.body;
    const claveEncriptada = await bcrypt.hash(clave, 10); // Encriptar la contraseña
    const nuevoUsuario = await Usuario.create({ clave: claveEncriptada, numero_documento, nombre_usuario, tipo_documento, id_rol, estado, correo_usuario, telefono_usuario }); // Crear el usuario en la base de datos
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

router.get('/todos', async (req, res) => {
  try {
    // Extraer parámetros de consulta
    const { numero_documento, nombre_usuario, tipo_documento, id_rol, estado, correo_usuario, telefono_usuario } = req.query;

    // Construir condiciones para la búsqueda
    const condiciones = {};
    if (numero_documento) condiciones.numero_documento = numero_documento;
    if (nombre_usuario) condiciones.nombre_usuario = nombre_usuario;
    if (tipo_documento) condiciones.tipo_documento = tipo_documento;
    if (estado) condiciones.estado = estado;
    if (correo_usuario) condiciones.correo_usuario = correo_usuario;
    if (telefono_usuario) condiciones.telefono_usuario = telefono_usuario;


    // Buscar usuarios en la base de datos incluyendo la relación con el modelo Rol
    const usuarios = await Usuario.findAll({
      where: condiciones,
      include: [{ model: Rol, as: 'Rol', attributes: ['id_rol', 'nombre'] }] // Incluye el rol y especifica qué atributos deseas
    });

    // Verifica que `usuarios` es un array
    if (!Array.isArray(usuarios)) {
      return res.status(500).json({ message: 'Error inesperado al obtener usuarios' });
    }

    // Mapa para devolver el formato deseado
    const resultado = usuarios.map(usuario => ({
      numero_documento: usuario.numero_documento,
      nombre_usuario: usuario.nombre_usuario,
      tipo_documento: usuario.tipo_documento,
      id_rol: usuario.id_rol,
      estado: usuario.estado,
      correo_usuario: usuario.correo_usuario,
      telefono_usuario: usuario.telefono_usuario,
      rol: usuario.Rol.nombre,
    }));

    if (resultado.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios' });
    }

    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});
// Ruta para obtener un usuario por número de documento
router.get('/:numero_documento', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ where: { numero_documento: req.params.numero_documento } });
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
});
// Actualizar un usuario por su número de documento
router.put('/actualizar/:numero_documento', async (req, res) => {
  try {
    const { numero_documento } = req.params;
    const { clave, nombre_usuario, tipo_documento, id_rol, estado, correo_usuario, telefono_usuario } = req.body;

    // Preparar los datos de actualización
    const datosActualizacion = {
      nombre_usuario,
      tipo_documento,
      id_rol,
      estado,
      correo_usuario,
      telefono_usuario
    };

    // Si se proporciona una nueva clave, encriptarla
    if (clave) {
      datosActualizacion.clave = await bcrypt.hash(clave, 10);
    }

    const [updated] = await Usuario.update(datosActualizacion, {
      where: { numero_documento }
    });

    if (updated) {
      const updatedUsuario = await Usuario.findOne({
        where: { numero_documento }
      });
      res.status(200).json(updatedUsuario);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});
// backend/routes/usuarioRoutes.js
router.patch('/estado/:numero_documento', async (req, res) => {
  try {
    const { estado } = req.body; // El estado debe ser 'Activo' o 'Desactivo'
    const [actualizado] = await Usuario.update({ estado }, {
      where: { numero_documento: req.params.numero_documento }
    });

    if (actualizado) {
      const usuarioActualizado = await Usuario.findOne({
        where: { numero_documento: req.params.numero_documento }
      });
      res.json(usuarioActualizado);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el estado del usuario' });
  }
});

module.exports = router;