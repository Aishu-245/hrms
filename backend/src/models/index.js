const sequelize = require('../db');
const Organisation = require('./Organisation');
const User = require('./User');
const Employee = require('./Employee');
const Team = require('./Team');
const EmployeeTeam = require('./EmployeeTeam');
const Log = require('./Log');

// Initialize database and create tables
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('✓ Database tables synchronized');
    
    return true;
  } catch (error) {
    console.error('✗ Unable to connect to database:', error);
    return false;
  }
}

module.exports = {
  sequelize,
  Organisation,
  User,
  Employee,
  Team,
  EmployeeTeam,
  Log,
  initializeDatabase,
};
