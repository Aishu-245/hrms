const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Employee = require('./Employee');
const Team = require('./Team');

const EmployeeTeam = sequelize.define('EmployeeTeam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Employee,
      key: 'id',
    },
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Team,
      key: 'id',
    },
  },
}, {
  tableName: 'employee_teams',
  timestamps: true,
  createdAt: 'assigned_at',
  updatedAt: false,
});

// Define many-to-many relationships
Employee.belongsToMany(Team, { through: EmployeeTeam, foreignKey: 'employee_id' });
Team.belongsToMany(Employee, { through: EmployeeTeam, foreignKey: 'team_id' });

module.exports = EmployeeTeam;
