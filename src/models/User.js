const { DataTypes } = require('sequelize');

const UserModel = (sequelize) => {
  const User = sequelize.define(
    'User',
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
    },
    {
      tableName: 'users',
      timestamps: true,
    }
  );

  return User;
};

module.exports = UserModel;
