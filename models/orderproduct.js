'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    static associate(models) {}
  }

  OrderProduct.init({
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Order',
        key: 'order_id'
      },
      onDelete: 'CASCADE'
    },
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Product',
        key: 'product_id'
      },
      onDelete: 'CASCADE'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'OrderProduct',
    tableName: 'OrderProduct',
    timestamps: false
  });

  return OrderProduct;
};