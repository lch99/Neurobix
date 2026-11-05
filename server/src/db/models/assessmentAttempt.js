'use strict';

module.exports = (sequelize, DataTypes) => {
  const AssessmentAttempt = sequelize.define(
    'AssessmentAttempt',
    {
      assessment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      answers: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      started_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'assessment_attempts',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  AssessmentAttempt.associate = (models) => {
    AssessmentAttempt.belongsTo(models.Assessment, { foreignKey: 'assessment_id', as: 'assessment' });
    AssessmentAttempt.belongsTo(models.User, { foreignKey: 'student_id', as: 'student' });
  };

  return AssessmentAttempt;
};
