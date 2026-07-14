'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('flashcards', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lesson_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'lessons', key: 'id' },
        onDelete: 'CASCADE',
        comment: 'Set when this card belongs to a lesson deck',
      },
      owner_student_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        comment: 'Set when this card is in a student personal library',
      },
      front_text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      front_image_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      back_text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      back_image_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      sequence_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addIndex('flashcards', ['lesson_id'], {
      name: 'idx_flashcards_lesson',
    });
    await queryInterface.addIndex('flashcards', ['owner_student_id'], {
      name: 'idx_flashcards_owner',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('flashcards');
  },
};
