'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venta extends Model {
    static associate(models) {
      // Una venta pertenece a un usuario
      Venta.belongsTo(models.Usuario, {
        foreignKey: 'numero_documento',
        as: 'usuario'
      });

      // Una venta puede tener muchos detalles de venta
      Venta.hasMany(models.Detalle_Venta, {
        foreignKey: 'id_venta',
        as: 'detalle_ventas'
      });
    }
  }
  Venta.init({
    id_venta: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fecha_venta: DataTypes.DATE,
    metodo_pago: DataTypes.ENUM('Efectivo', 'Tarjeta', 'Transferencia'),
    caja: DataTypes.INTEGER,
    total_venta: DataTypes.DECIMAL(10, 2),
    numero_documento: {
      type: DataTypes.BIGINT,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Venta',
    timestamps: false,
  });
  return Venta;
};
