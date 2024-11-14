const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Incidencia = sequelize.define("Incidencia", {
    id_incidencia: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    descripcion_incidencia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_incidencia: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    cantidad_afectada: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Productos', 
        key: 'id_producto',
      },
    },
  }, {
    tableName: 'Incidencias', 
    timestamps: true, 
  });

  Incidencia.associate = (models) => {
    Incidencia.belongsTo(models.Producto, {
      foreignKey: "id_producto",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };

  Incidencia.associate = (models) => {
    Incidencia.belongsTo(models.Producto, {
      foreignKey: "id_producto",
      as: 'producto', 
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };

  return Incidencia;
};
