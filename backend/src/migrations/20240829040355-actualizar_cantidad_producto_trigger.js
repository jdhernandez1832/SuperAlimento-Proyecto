'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE TRIGGER actualizar_cantidad_producto
      AFTER INSERT ON Detalle_Venta
      FOR EACH ROW
      BEGIN
        UPDATE Productos
        SET cantidad = cantidad - NEW.cantidad
        WHERE id_producto = NEW.id_producto;
      END
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS actualizar_cantidad_producto');
  }
};
