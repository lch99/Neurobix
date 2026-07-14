'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('lessons', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'classes', key: 'id' },
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('video', 'flashcard', 'quiz', 'reading', 'activity'),
        allowNull: false,
      },
      sequence_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Ordering within a regular class; enforces sequential unlock',
      },
      difficulty: {
        type: Sequelize.ENUM('Easy', 'Medium', 'Hard'),
        allowNull: true,
      },
      duration_minutes: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      icon_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      video_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'Used when type = video',
      },
      reading_content: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Used when type = reading',
      },
      status: {
        type: Sequelize.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'draft',
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

    await queryInterface.addIndex('lessons', ['class_id', 'sequence_order'], {
      name: 'idx_lessons_class_order',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('lessons');
  },
};
