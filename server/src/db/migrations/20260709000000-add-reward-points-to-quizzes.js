'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('quizzes', 'reward_points', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 10,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('quizzes', 'reward_points');
  },
};
