'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Widen the lessons.type enum to accept 'assessment' alongside the old 'quiz' value,
    //    migrate existing rows, then narrow the enum to drop 'quiz'.
    await queryInterface.changeColumn('lessons', 'type', {
      type: Sequelize.ENUM('video', 'flashcard', 'quiz', 'assessment', 'reading', 'activity'),
      allowNull: false,
    });
    await queryInterface.sequelize.query(
      "UPDATE lessons SET type = 'assessment' WHERE type = 'quiz'"
    );
    await queryInterface.changeColumn('lessons', 'type', {
      type: Sequelize.ENUM('video', 'flashcard', 'assessment', 'reading', 'activity'),
      allowNull: false,
    });

    // 2. Rename quizzes -> assessments, quiz_questions -> assessment_questions,
    //    quiz_attempts -> assessment_attempts, and their quiz_id FK columns.
    await queryInterface.renameTable('quizzes', 'assessments');
    await queryInterface.renameTable('quiz_questions', 'assessment_questions');
    await queryInterface.renameTable('quiz_attempts', 'assessment_attempts');

    await queryInterface.renameColumn('assessment_questions', 'quiz_id', 'assessment_id');
    await queryInterface.renameColumn('assessment_attempts', 'quiz_id', 'assessment_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('assessment_attempts', 'assessment_id', 'quiz_id');
    await queryInterface.renameColumn('assessment_questions', 'assessment_id', 'quiz_id');

    await queryInterface.renameTable('assessment_attempts', 'quiz_attempts');
    await queryInterface.renameTable('assessment_questions', 'quiz_questions');
    await queryInterface.renameTable('assessments', 'quizzes');

    await queryInterface.changeColumn('lessons', 'type', {
      type: Sequelize.ENUM('video', 'flashcard', 'assessment', 'quiz', 'reading', 'activity'),
      allowNull: false,
    });
    await queryInterface.sequelize.query(
      "UPDATE lessons SET type = 'quiz' WHERE type = 'assessment'"
    );
    await queryInterface.changeColumn('lessons', 'type', {
      type: Sequelize.ENUM('video', 'flashcard', 'quiz', 'reading', 'activity'),
      allowNull: false,
    });
  },
};
