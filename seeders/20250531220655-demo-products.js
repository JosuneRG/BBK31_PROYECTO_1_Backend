'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Producto 1',
        description: 'Descripción del producto 1',
        price: 10.99,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Producto 2',
        description: 'Descripción del producto 2',
        price: 15.50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Producto 3',
        description: 'Descripción del producto 3',
        price: 7.30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Producto 4',
        description: 'Descripción del producto 4',
        price: 22.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Producto 5',
        description: 'Descripción del producto 5',
        price: 18.75,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
