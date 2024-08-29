'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Venta', {
      id_venta: {
        type: Sequelize.INTEGER, // Usa INTEGER en lugar de INT
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      fecha_venta: {
        type: Sequelize.DATE, // Usa DATE en lugar de DATETIME
        allowNull: false,
      },
      metodo_pago: {
        type: Sequelize.ENUM('Efectivo', 'Tarjeta', 'Transferencia'),
        allowNull: false,
      },
      caja: {
        type: Sequelize.INTEGER, // Usa INTEGER en lugar de INT
        allowNull: false,
      },
      total_venta: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      numero_documento: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Usuarios', // Asegúrate de que este modelo exista
          key: 'numero_documento', // Clave primaria en la tabla Usuario
        },
        onUpdate: 'CASCADE', // Opcional: maneja actualizaciones en cascada
        onDelete: 'CASCADE', // Opcional: maneja eliminaciones en cascada
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Venta');
  }
};
