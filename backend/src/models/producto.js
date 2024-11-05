'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      // Un producto pertenece a una categoría
      Producto.belongsTo(models.Categoria, {
        foreignKey: 'id_categoria',
        as: 'categoria' // Alias único para la asociación con Categoria
      });

      // Un producto puede estar en muchas solicitudes
      Producto.belongsToMany(models.Solicitud, {
        through: models.Solicitud_Producto,
        foreignKey: 'id_producto',
        as: 'solicitudes'
      });

      // Un producto puede aparecer en muchos detalles de venta
      Producto.hasMany(models.Detalle_Venta, {
        foreignKey: 'id_producto',
        as: 'detalle_ventas'
      });

      // Un producto pertenece a un proveedor
      Producto.belongsTo(models.Proveedor, {
        foreignKey: 'id_proveedor',
        as: 'proveedor' // Cambia el alias a 'proveedor' para evitar conflicto
      });
    }
  }

  Producto.init({
    id_producto: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nombre_producto: DataTypes.STRING,
    codigo_barras: DataTypes.BIGINT,
    precio_compra: DataTypes.INTEGER,
    precio_venta: DataTypes.INTEGER,
    descripcion_producto: DataTypes.STRING,
    estado: DataTypes.ENUM('activo', 'inactivo'),
    imagen: DataTypes.STRING,
    id_categoria: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    numero_documento: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    id_proveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    estado: DataTypes.ENUM('Activo','Desactivo')
  }, {
    sequelize,
    modelName: 'Producto',
    timestamps: false,
  });

  return Producto;
};
