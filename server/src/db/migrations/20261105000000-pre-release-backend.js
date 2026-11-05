'use strict';

// Brings the schema up to what the client UI already uses against the mock data layer:
// account flags, class terms/slots/co-teachers, richer lesson content, the "match" question
// type, class-level quizzes, and per-student flash card library + study progress.
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ── Users ──────────────────────────────────────────────────────────────────
    await queryInterface.addColumn('users', 'must_change_credential', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Forces a new password/PIN on next login (temp credentials)',
    });
    await queryInterface.addColumn('users', 'reset_password_hash', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Temporary password from "forgot password"; the real password keeps working until it is used',
    });
    await queryInterface.addColumn('users', 'reset_expires_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // ── Classes ────────────────────────────────────────────────────────────────
    await queryInterface.addColumn('classes', 'slots', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Seat limit for extra/open classes',
    });
    await queryInterface.addColumn('classes', 'co_teachers', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('classes', 'term_ids', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'All terms the class runs in; term_id stays the primary term',
    });
    await queryInterface.addColumn('classes', 'forced_open_term_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'terms', key: 'id' },
      onDelete: 'SET NULL',
      comment: 'Admin override that keeps one term open on an archived class',
    });

    // ── Lessons ────────────────────────────────────────────────────────────────
    await queryInterface.addColumn('lessons', 'objectives', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('lessons', 'memory_tip', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('lessons', 'reading_sections', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    // ── Assessment questions: "match" type, nullable answer, long image URLs ─────
    await queryInterface.changeColumn('assessment_questions', 'type', {
      type: Sequelize.ENUM('mcq', 'true_false', 'fill_in', 'image', 'match'),
      allowNull: false,
    });
    await queryInterface.changeColumn('assessment_questions', 'correct_answer', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Null for "match" questions (answer is the pairs in options)',
    });
    await queryInterface.changeColumn('assessment_questions', 'question_image_url', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // ── Quizzes: ungraded, class-level card sets placed after a lesson ───────────
    await queryInterface.createTable('quizzes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'classes', key: 'id' },
        onDelete: 'CASCADE',
      },
      title: { type: Sequelize.STRING(150), allowNull: false },
      status: { type: Sequelize.ENUM('draft', 'published'), allowNull: false, defaultValue: 'draft' },
      after_lesson_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'lessons', key: 'id' },
        onDelete: 'SET NULL',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addIndex('quizzes', ['class_id'], { name: 'idx_quizzes_class' });

    await queryInterface.createTable('quiz_cards', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'quizzes', key: 'id' },
        onDelete: 'CASCADE',
      },
      front_text: { type: Sequelize.TEXT, allowNull: true },
      back_text: { type: Sequelize.TEXT, allowNull: true },
      hint: { type: Sequelize.TEXT, allowNull: true },
      sequence_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addIndex('quiz_cards', ['quiz_id'], { name: 'idx_quiz_cards_quiz' });

    // ── Personal flash card library (per student — never shared) ────────────────
    await queryInterface.createTable('flashcard_library', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      flashcard_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'flashcards', key: 'id' },
        onDelete: 'SET NULL',
        comment: 'Source card; the text is copied so the saved card survives edits/deletes',
      },
      subject: { type: Sequelize.STRING(50), allowNull: true },
      front_text: { type: Sequelize.TEXT, allowNull: true },
      back_text: { type: Sequelize.TEXT, allowNull: true },
      hint: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addConstraint('flashcard_library', {
      fields: ['student_id', 'flashcard_id'],
      type: 'unique',
      name: 'uk_flashcard_library_student_card',
    });

    // ── Flash card study progress (Study Set modes) ──────────────────────────────
    await queryInterface.createTable('flashcard_progress', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      deck_key: {
        type: Sequelize.STRING(64),
        allowNull: false,
        defaultValue: '',
        comment: 'e.g. lesson-18, quiz-1, library — card ids are only unique within a deck type',
      },
      card_id: { type: Sequelize.INTEGER, allowNull: false },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'new' },
      correct_streak: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      starred: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addConstraint('flashcard_progress', {
      fields: ['student_id', 'deck_key', 'card_id'],
      type: 'unique',
      name: 'uk_flashcard_progress_student_deck_card',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('flashcard_progress');
    await queryInterface.dropTable('flashcard_library');
    await queryInterface.dropTable('quiz_cards');
    await queryInterface.dropTable('quizzes');

    await queryInterface.sequelize.query("DELETE FROM assessment_questions WHERE type = 'match'");
    // Inline (data:) images can exceed the old 500-char column; drop them rather than fail.
    await queryInterface.sequelize.query('UPDATE assessment_questions SET question_image_url = NULL WHERE CHAR_LENGTH(question_image_url) > 500');
    await queryInterface.changeColumn('assessment_questions', 'question_image_url', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
    await queryInterface.sequelize.query("UPDATE assessment_questions SET correct_answer = 'null' WHERE correct_answer IS NULL");
    await queryInterface.changeColumn('assessment_questions', 'correct_answer', {
      type: Sequelize.JSON,
      allowNull: false,
    });
    await queryInterface.changeColumn('assessment_questions', 'type', {
      type: Sequelize.ENUM('mcq', 'true_false', 'fill_in', 'image'),
      allowNull: false,
    });

    await queryInterface.removeColumn('lessons', 'reading_sections');
    await queryInterface.removeColumn('lessons', 'memory_tip');
    await queryInterface.removeColumn('lessons', 'objectives');

    await queryInterface.removeConstraint('classes', 'classes_forced_open_term_id_foreign_idx').catch(() => {});
    await queryInterface.removeColumn('classes', 'forced_open_term_id');
    await queryInterface.removeColumn('classes', 'term_ids');
    await queryInterface.removeColumn('classes', 'co_teachers');
    await queryInterface.removeColumn('classes', 'slots');

    await queryInterface.removeColumn('users', 'reset_expires_at');
    await queryInterface.removeColumn('users', 'reset_password_hash');
    await queryInterface.removeColumn('users', 'must_change_credential');
  },
};
