'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Proveedor extends Model {
    static associate(models) {
      // Un proveedor puede tener muchas solicitudes
      Proveedor.hasMany(models.Solicitud, {
        foreignKey: 'id_proveedor',
        as: 'solicitudes'
      });
    }
  }
  Proveedor.init({
    id_proveedor: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nombre_proveedor: DataTypes.STRING,
    numero_documento: DataTypes.BIGINT,
    tipo_documento: DataTypes.ENUM('Cédula', 'RUC', 'Pasaporte'),
    telefono_proveedor: DataTypes.BIGINT,
    correo_proveedor: DataTypes.STRING,
    estado: DataTypes.ENUM('Activo','Desactivo')
  }, {
    sequelize,
    modelName: 'Proveedor',
    timestamps: false,
  });
  return Proveedor;
};
