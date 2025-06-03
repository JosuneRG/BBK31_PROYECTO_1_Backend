'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    static associate(models) {}
  }

  ProductCategory.init({
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Product',
        key: 'product_id'
      },
      onDelete: 'CASCADE'
    },
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Category',
        key: 'category_id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'ProductCategory',
    tableName: 'ProductCategory',
    timestamps: false
  });

  return ProductCategory;
};
