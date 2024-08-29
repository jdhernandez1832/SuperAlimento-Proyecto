'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE TRIGGER actualizar_producto_cantidad
      AFTER UPDATE ON solicituds
      FOR EACH ROW
      BEGIN
        IF NEW.estado_solicitud = 'Aprobada' AND OLD.estado_solicitud != 'Aprobada' THEN
          UPDATE productos p
          JOIN Solicitud_Productos sp ON p.id_producto = sp.id_producto
          SET p.cantidad = p.cantidad + sp.cantidad
          WHERE sp.id_solicitud = NEW.id_solicitud;
        END IF;
      END
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS actualizar_producto_cantidad');
  }
};
