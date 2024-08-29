'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Solicitud extends Model {
    static associate(models) {
      // Una solicitud pertenece a un usuario
      Solicitud.belongsTo(models.Usuario, {
        foreignKey: 'numero_documento',
        as: 'usuario'
      });

      // Una solicitud pertenece a un proveedor
      Solicitud.belongsTo(models.Proveedor, {
        foreignKey: 'id_proveedor',
        as: 'proveedor'
      });

      // Una solicitud puede tener muchos productos a través de la tabla intermedia
      Solicitud.belongsToMany(models.Producto, {
        through: models.Solicitud_Producto,
        foreignKey: 'id_solicitud',
        as: 'productos'
      });
    }
  }
  Solicitud.init({
    id_solicitud: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fecha_entrada: DataTypes.DATE,
    estado_solicitud: DataTypes.ENUM('Pendiente', 'Aprobada', 'Rechazada'),
    precio_total: DataTypes.DECIMAL(10, 2),
    observacion: DataTypes.STRING,
    numero_documento: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    id_proveedor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado: DataTypes.ENUM('Activo','Desactivo')
  }, {
    sequelize,
    modelName: 'Solicitud',
    timestamps: false,
  });
  return Solicitud;
};
