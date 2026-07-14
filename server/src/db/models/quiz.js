'use strict';

module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define(
    'Quiz',
    {
      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      is_past_year_paper: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      pass_mark: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 70,
      },
      leaderboard_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      reward_points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
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
    Quiz.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson' });
    Quiz.hasMany(models.QuizQuestion, { foreignKey: 'quiz_id', as: 'questions' });
  };

  return Quiz;
};
