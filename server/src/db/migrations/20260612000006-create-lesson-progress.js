'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('lesson_progress', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      lesson_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'lessons', key: 'id' },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('locked', 'pending', 'in_progress', 'completed', 'overdue'),
        allowNull: false,
        defaultValue: 'pending',
      },
      progress_percent: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint('lesson_progress', {
      fields: ['student_id', 'lesson_id'],
      type: 'unique',
      name: 'uk_lesson_progress_student_lesson',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('lesson_progress');
  },
};
