'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Solicitud_Producto extends Model {
    static associate(models) {
      // Puedes definir asociaciones si es necesario
    }
  }
  Solicitud_Producto.init({
    id_abastecimiento: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_solicitud: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Solicitud_Producto',
    timestamps: false,
  });
  return Solicitud_Producto;
};
