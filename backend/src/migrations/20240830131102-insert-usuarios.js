'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10; 

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const hashedPassword1 = await bcrypt.hash('Ti1232345', saltRounds);
    const hashedPassword2 = await bcrypt.hash('elpepe1', saltRounds);

    return queryInterface.bulkInsert('Usuarios', [
      {
        numero_documento: 107232,
        nombre_usuario: 'Julian Hernandez',
        tipo_documento: 'Cédula',
        correo_usuario: 'julian@hotmail.com',
        telefono_usuario: 3052456,
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
