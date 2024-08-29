'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Solicitud_Productos', {
      id_abastecimiento: {
        type: Sequelize.INTEGER, // Asegúrate de usar INTEGER en lugar de INT
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id_solicitud: {
        type: Sequelize.INTEGER, // Asegúrate de usar INTEGER en lugar de INT
        allowNull: false,
        references: {
          model: 'Solicituds', // Nombre de la tabla referenciada
          key: 'id_solicitud', // Clave primaria en la tabla referenciada
        },
        onUpdate: 'CASCADE', // Opcional: maneja las actualizaciones en cascada
        onDelete: 'CASCADE', // Opcional: maneja las eliminaciones en cascada
      },
      id_producto: {
        type: Sequelize.INTEGER, // Asegúrate de usar INTEGER en lugar de INT
        allowNull: false,
        references: {
          model: 'Productos', // Nombre de la tabla referenciada
          key: 'id_producto', // Clave primaria en la tabla referenciada
        },
        onUpdate: 'CASCADE', // Opcional: maneja las actualizaciones en cascada
        onDelete: 'CASCADE', // Opcional: maneja las eliminaciones en cascada
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Solicitud_Producto');
  }
};
