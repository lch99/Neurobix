'use strict';

module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define(
    'Schedule',
    {
      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      publish_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deadline_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notify_email: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'schedules',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Schedule.associate = (models) => {
    Schedule.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson' });
    Schedule.belongsTo(models.Class, { foreignKey: 'class_id', as: 'class' });
  };

  return Schedule;
};
