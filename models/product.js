'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsToMany(models.Category, {
        through: 'ProductCategory',
        foreignKey: 'product_id'
      });
      Product.belongsToMany(models.Order, {
        through: 'OrderProduct',
        foreignKey: 'product_id'
      });
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id'
      });
    }
  }

  Product.init({
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Category',
        key: 'category_id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Product',
    timestamps: false
  });

  return Product;
};