'use strict';
const { getRandomDataForPage } = require('./questions')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
    */
    
    // await queryInterface.bulkInsert('Pages', await getRandomDataForPage(), {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
    */
    await queryInterface.bulkDelete('Pages', null, {});
  }
};
