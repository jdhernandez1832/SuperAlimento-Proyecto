'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Rol', [
      { nombre: 'Administrador'},
      { nombre: 'Cajero' },
      { nombre: 'Inventarista'  }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Rol', null, {});
  }
};
