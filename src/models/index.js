const UserModel = require('./User');
const ProductModel = require('./Product');
const ConfigModel = require('./Config');

const initializeModels = (sequelize) => {
  const User = UserModel(sequelize);
  const Product = ProductModel(sequelize);
  const Config = ConfigModel(sequelize);

  return {
    User,
    Product,
    Config,
  };
};

module.exports = { initializeModels };
