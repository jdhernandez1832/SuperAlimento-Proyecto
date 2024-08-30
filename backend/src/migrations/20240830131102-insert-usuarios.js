'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10; 

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const hashedPassword1 = await bcrypt.hash('Ti1075792381', saltRounds);
    const hashedPassword2 = await bcrypt.hash('elpepe1', saltRounds);

    return queryInterface.bulkInsert('Usuarios', [
      {
        numero_documento: 1075792381,
        nombre_usuario: 'Julian Hernandez',
        tipo_documento: 'Cédula',
        correo_usuario: 'julian.hernandez1563@hotmail.com',
        telefono_usuario: 3052433356,
        clave: hashedPassword1,
        id_rol: 1,
        estado: 'Activo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        numero_documento: 987654321,
        nombre_usuario: 'María Gómez',
        tipo_documento: 'RUC',
        correo_usuario: 'maria.gomez@example.com',
        telefono_usuario: 123456789,
        clave: hashedPassword2,
        id_rol: 2, 
        estado: 'Activo',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Usuarios', null, {});
  }
};
