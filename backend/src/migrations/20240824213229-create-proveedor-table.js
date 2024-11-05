const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Productos', {
      id_producto: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nombre_producto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      codigo_barras: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      precio_compra: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      precio_venta: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      descripcion_producto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      estado: {
        type: Sequelize.ENUM('Activo', 'Desactivo'),
        allowNull: false,
        defaultValue: 'Activo'
      },
      id_categoria: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        references: {
          model: 'Categoria',
          key: 'id_categoria',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      imagen: DataTypes.STRING,
      numero_documento: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'numero_documento',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      id_proveedor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Proveedors',
          key: 'id_proveedor',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Productos');
  }
};

