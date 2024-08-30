'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Un usuario puede tener muchas solicitudes
      Usuario.hasMany(models.Solicitud, {
        foreignKey: 'numero_documento',
        as: 'solicitudes'
      });

      // Un usuario puede tener muchas ventas
      Usuario.hasMany(models.Venta, {
        foreignKey: 'numero_documento',
        as: 'ventas'
      });

      // Un usuario puede crear muchos productos
      Usuario.hasMany(models.Producto, {
        foreignKey: 'numero_documento',
        as: 'productos'
      });
      Usuario.belongsTo(models.Rol, { as: 'Rol', foreignKey: 'id_rol' });
    }
  }
  Usuario.init({
    numero_documento: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    nombre_usuario: DataTypes.STRING,
    tipo_documento: DataTypes.ENUM('Cédula', 'RUC', 'Pasaporte'),
    correo_usuario: DataTypes.STRING,
    telefono_usuario: DataTypes.BIGINT,
    clave: DataTypes.STRING,
    id_rol: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    estado: DataTypes.ENUM('Activo','Desactivo')
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};
