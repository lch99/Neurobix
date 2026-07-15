'use strict';

module.exports = (sequelize, DataTypes) => {
  const Assessment = sequelize.define(
    'Assessment',
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
      tableName: 'assessments',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Assessment.associate = (models) => {
    Assessment.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson' });
    Assessment.hasMany(models.AssessmentQuestion, { foreignKey: 'assessment_id', as: 'questions' });
  };

  return Assessment;
};
