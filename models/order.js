'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
Order.init({
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    order_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    total: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Order',
    timestamps: false
  });

  return Order;
};