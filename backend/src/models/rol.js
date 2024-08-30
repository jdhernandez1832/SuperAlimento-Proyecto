'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rol extends Model {
    static associate(models) {
      // Relación uno a muchos: un rol tiene muchos usuarios
      Rol.hasMany(models.Usuario, {
        foreignKey: 'id_rol',
        as: 'usuarios'
      });
    }
  }

  Rol.init({
    id_rol: {
      type: DataTypes.SMALLINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Rol',
    tableName: 'Rol', // Asegura que el nombre de la tabla coincida con la migración
    timestamps: false // Asume que no tienes columnas createdAt o updatedAt
  });

  return Rol;
};
