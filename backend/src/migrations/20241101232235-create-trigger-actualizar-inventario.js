module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear el trigger para actualizar el inventario tras insertar una incidencia
    await queryInterface.sequelize.query(`
      CREATE TRIGGER actualizar_inventario_tras_incidencia
      AFTER INSERT ON Incidencias
      FOR EACH ROW
      BEGIN
        UPDATE Productos
        SET cantidad = cantidad - NEW.cantidad_afectada
        WHERE id_producto = NEW.id_producto;
      END;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Borrar el trigger si existe
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS actualizar_inventario_tras_incidencia;
    `);
  }
};
