const { DataTypes } = require('sequelize');

const ProductModel = (sequelize) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unsigned: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(55),
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      isAvailable: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
      },
      deleted: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'products',
      timestamps: true,
    }
  );

  return Product;
};

module.exports = ProductModel;
