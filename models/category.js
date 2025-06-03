'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.Product, { through: 'ProductCategory', foreignKey: 'category_id' });
    }
  }

  Category.init({
    category_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'Category',
    timestamps: false
  });

  return Category;
};