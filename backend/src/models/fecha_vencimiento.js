'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FechaVencimiento extends Model {
    static associate(models) {
      // Una fecha de vencimiento pertenece a un producto
      FechaVencimiento.belongsTo(models.Producto, {
        foreignKey: 'id_producto',
        as: 'producto'
      });
    }
  }
  
  FechaVencimiento.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Productos', // Asegúrate de que este nombre coincida con el modelo de Producto
        key: 'id',
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lote: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_vencimiento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'FechaVencimiento',
    tableName: 'fechas_vencimiento',
    timestamps: false,
  });
  
  return FechaVencimiento;
};
