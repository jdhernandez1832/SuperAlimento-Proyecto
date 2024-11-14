'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fechas_vencimiento', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id_producto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Productos',   // Asegúrate que el nombre de la tabla sea 'productos'
          key: 'id_producto'    // Llave primaria de la tabla productos
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      lote: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fecha_vencimiento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('fechas_vencimiento');
  }
};
