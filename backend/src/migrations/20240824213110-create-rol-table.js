'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Usuarios', {
      numero_documento: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      nombre_usuario: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tipo_documento: {
        type: Sequelize.ENUM('Cédula', 'RUC', 'Pasaporte'),
        allowNull: false,
      },
      correo_usuario: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      telefono_usuario: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      clave: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_rol: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        references: {
          model: 'Rol',
          key: 'id_rol',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      estado: {
        type: Sequelize.ENUM('Activo', 'Desactivo'),
        allowNull: false,
        defaultValue: 'Activo'
      }      
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Usuarios');
  }
};