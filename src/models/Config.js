const { DataTypes } = require('sequelize');

const ConfigModel = (sequelize) => {
  const Config = sequelize.define(
    'Config',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unsigned: true,
        allowNull: false,
      },
      key: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      value: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: 'configs',
      timestamps: true,
    }
  );

  return Config;
};

module.exports = ConfigModel;
