module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Solicituds', {
      id_solicitud: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      fecha_entrada: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      estado_solicitud: {
        type: Sequelize.ENUM('Pendiente', 'Aprobada', 'Rechazada'),
        allowNull: false,
      },
      precio_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      observacion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
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
      },
      estado: {
        type: Sequelize.ENUM('Activo', 'Desactivo'),
        allowNull: false,
        defaultValue: 'Activo'
      }      
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Solicitud');
  }
};
