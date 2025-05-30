'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: 'category_id' });
      Product.belongsToMany(models.Category, { through: 'ProductCategory', foreignKey: 'product_id' });
      Product.belongsToMany(models.Order, { through: 'OrderProduct', foreignKey: 'product_id' });
    }
  }

  Product.init({
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2),
    stock: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Product',
    timestamps: false
  });

  return Product;
};
