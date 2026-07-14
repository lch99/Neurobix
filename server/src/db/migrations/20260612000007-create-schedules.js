'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('schedules', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lesson_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'lessons', key: 'id' },
        onDelete: 'CASCADE',
      },
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'classes', key: 'id' },
        onDelete: 'CASCADE',
      },
      publish_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Null = publish immediately',
      },
      deadline_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      notify_email: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addIndex('schedules', ['class_id'], {
      name: 'idx_schedules_class',
    });
    await queryInterface.addIndex('schedules', ['lesson_id'], {
      name: 'idx_schedules_lesson',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('schedules');
  },
};
