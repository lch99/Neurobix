'use strict';

// A Quiz belongs to a Class (not a Lesson) and sits after a lesson via after_lesson_id.
// It is ungraded self-practice: no points, leaderboard or certificates.
module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define(
    'Quiz',
    {
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'draft',
      },
      after_lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'quizzes',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Quiz.associate = (models) => {
    Quiz.belongsTo(models.Class, { foreignKey: 'class_id', as: 'class' });
    Quiz.belongsTo(models.Lesson, { foreignKey: 'after_lesson_id', as: 'afterLesson' });
    Quiz.hasMany(models.QuizCard, { foreignKey: 'quiz_id', as: 'cards' });
  };

  return Quiz;
};
