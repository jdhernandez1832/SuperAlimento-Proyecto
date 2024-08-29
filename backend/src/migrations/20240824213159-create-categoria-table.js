'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Categoria', {
      id_categoria: {
        type: Sequelize.SMALLINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      estado: {
        type: Sequelize.ENUM('Activo', 'Desactivo'),
        allowNull: false,
        defaultValue: 'Activo'
      }
      
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Categoria');
  }
};
