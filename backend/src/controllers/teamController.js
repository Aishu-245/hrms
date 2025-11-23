const { Team, Employee, EmployeeTeam, Log } = require('../models');

// Get all teams for the organisation
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      where: { organisation_id: req.user.orgId },
      include: [{
        model: Employee,
        through: { attributes: [] },
      }],
      order: [['created_at', 'DESC']],
    });

    res.json(teams);
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ message: 'Failed to fetch teams', error: error.message });
  }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findOne({
      where: {
        id,
        organisation_id: req.user.orgId,
      },
      include: [{
        model: Employee,
        through: { attributes: ['assigned_at'] },
      }],
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ message: 'Failed to fetch team', error: error.message });
  }
};

// Create new team
exports.createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    const team = await Team.create({
      organisation_id: req.user.orgId,
      name,
      description,
    });

    // Log the action
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'team_created',
      meta: {
        teamId: team.id,
        teamName: name,
      },
    });

    res.status(201).json(team);
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ message: 'Failed to create team', error: error.message });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const team = await Team.findOne({
      where: {
        id,
        organisation_id: req.user.orgId,
      },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Update fields
    if (name !== undefined) team.name = name;
    if (description !== undefined) team.description = description;

    await team.save();

    // Log the action
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'team_updated',
      meta: {
        teamId: team.id,
        teamName: team.name,
      },
    });

    res.json(team);
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ message: 'Failed to update team', error: error.message });
  }
};

// Delete team
exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findOne({
      where: {
        id,
        organisation_id: req.user.orgId,
      },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const teamName = team.name;

    await team.destroy();

    // Log the action
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'team_deleted',
      meta: {
        teamId: id,
        teamName,
      },
    });

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({ message: 'Failed to delete team', error: error.message });
  }
};

// Assign employee to team
exports.assignEmployeeToTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }

    // Verify team belongs to organisation
    const team = await Team.findOne({
      where: {
        id: teamId,
        organisation_id: req.user.orgId,
      },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Verify employee belongs to organisation
    const employee = await Employee.findOne({
      where: {
        id: employeeId,
        organisation_id: req.user.orgId,
      },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if assignment already exists
    const existingAssignment = await EmployeeTeam.findOne({
      where: {
        employee_id: employeeId,
        team_id: teamId,
      },
    });

    if (existingAssignment) {
      return res.status(409).json({ message: 'Employee already assigned to this team' });
    }

    // Create assignment
    await EmployeeTeam.create({
      employee_id: employeeId,
      team_id: teamId,
    });

    // Log the action
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'employee_assigned_to_team',
      meta: {
        employeeId,
        employeeName: `${employee.first_name} ${employee.last_name}`,
        teamId,
        teamName: team.name,
      },
    });

    res.status(201).json({ message: 'Employee assigned to team successfully' });
  } catch (error) {
    console.error('Assign employee error:', error);
    res.status(500).json({ message: 'Failed to assign employee', error: error.message });
  }
};

// Unassign employee from team
exports.unassignEmployeeFromTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }

    // Verify team and employee belong to organisation
    const team = await Team.findOne({
      where: { id: teamId, organisation_id: req.user.orgId },
    });

    const employee = await Employee.findOne({
      where: { id: employeeId, organisation_id: req.user.orgId },
    });

    if (!team || !employee) {
      return res.status(404).json({ message: 'Team or employee not found' });
    }

    // Delete assignment
    const deleted = await EmployeeTeam.destroy({
      where: {
        employee_id: employeeId,
        team_id: teamId,
      },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Log the action
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'employee_unassigned_from_team',
      meta: {
        employeeId,
        employeeName: `${employee.first_name} ${employee.last_name}`,
        teamId,
        teamName: team.name,
      },
    });

    res.json({ message: 'Employee unassigned from team successfully' });
  } catch (error) {
    console.error('Unassign employee error:', error);
    res.status(500).json({ message: 'Failed to unassign employee', error: error.message });
  }
};
