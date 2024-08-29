'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Detalle_Venta', {
      id_detalle: {
        type: Sequelize.INTEGER, // Usa INTEGER en lugar de INT
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id_producto: {
        type: Sequelize.INTEGER, // Usa INTEGER en lugar de INT
        allowNull: false,
        references: {
          model: 'Productos', // Nombre de la tabla referenciada
          key: 'id_producto', // Clave primaria en la tabla referenciada
        },
        onUpdate: 'CASCADE', // Opcional: maneja actualizaciones en cascada
        onDelete: 'CASCADE', // Opcional: maneja eliminaciones en cascada
      },
      id_venta: {
        type: Sequelize.INTEGER, // Usa INTEGER en lugar de INT
        allowNull: false,
        references: {
          model: 'Venta', // Nombre de la tabla referenciada
          key: 'id_venta', // Clave primaria en la tabla referenciada
        },
        onUpdate: 'CASCADE', // Opcional: maneja actualizaciones en cascada
        onDelete: 'CASCADE', // Opcional: maneja eliminaciones en cascada
      },
      cantidad: {
        type: Sequelize.INTEGER, // Usa INTEGER en lugar de INT
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Detalle_Venta');
  }
};
