'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detalle_Venta extends Model {
    static associate(models) {
      // Un detalle de venta pertenece a una venta
      Detalle_Venta.belongsTo(models.Venta, {
        foreignKey: 'id_venta',
        as: 'venta'
      });

      // Un detalle de venta pertenece a un producto
      Detalle_Venta.belongsTo(models.Producto, {
        foreignKey: 'id_producto',
        as: 'producto'
      });
    }
  }
  Detalle_Venta.init({
    id_detalle: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_venta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Detalle_Venta',
    timestamps: false,
  });
  return Detalle_Venta;
};
