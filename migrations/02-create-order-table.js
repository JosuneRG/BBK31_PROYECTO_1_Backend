'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Order', {
      order_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      order_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      total: {
        type: Sequelize.DECIMAL(10, 2)
      },
      status: {
        type: Sequelize.ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled'),
        defaultValue: 'pending'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Order');
  }
};
