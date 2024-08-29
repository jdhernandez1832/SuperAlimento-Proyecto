module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Proveedors', {
      id_proveedor: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nombre_proveedor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      numero_documento: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      tipo_documento: {
        type: Sequelize.ENUM('Cédula', 'RUC', 'Pasaporte'),
        allowNull: false,
      },
      telefono_proveedor: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      correo_proveedor: {
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
    await queryInterface.dropTable('Proveedors');
  }
};