'use strict';

module.exports = (sequelize, DataTypes) => {
  const Term = sequelize.define(
    'Term',
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('upcoming', 'active', 'completed'),
        allowNull: false,
        defaultValue: 'upcoming',
      },
    },
    {
      tableName: 'terms',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Term.associate = (models) => {
    Term.hasMany(models.Class, { foreignKey: 'term_id', as: 'classes' });
  };

  return Term;
};
