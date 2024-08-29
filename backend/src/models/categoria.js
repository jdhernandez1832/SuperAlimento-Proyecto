'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    
    static associate(models) {
      // Una categoría puede tener muchos productos
      Categoria.hasMany(models.Producto, {
        foreignKey: 'id_categoria',
        as: 'productos'
      });
    }
  }
  Categoria.init({
    id_categoria: {
      type: DataTypes.SMALLINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nombre: DataTypes.STRING,
    estado: DataTypes.ENUM('Activo','Desactivo')
  }, {
    sequelize,
    modelName: 'Categoria',
    timestamps: false,
  });
  return Categoria;
};
