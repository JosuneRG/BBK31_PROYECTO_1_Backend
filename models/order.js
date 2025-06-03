'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'user_id' });
      Order.belongsToMany(models.Product, {
        through: 'OrderProduct',
        foreignKey: 'order_id'
      });
    }
  }

  Order.init({
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'user_id'
      },
      onDelete: 'CASCADE'
    },
    order_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    total: {
      type: DataTypes.DECIMAL(10, 2)
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Order',
    timestamps: false
  });

  return Order;
};