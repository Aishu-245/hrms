const { Employee, Team, EmployeeTeam, Log } = require('../models');

// Get all employees for the organisation
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { organisation_id: req.user.orgId },
      include: [{
        model: Team,
        through: { attributes: [] },
      }],
      order: [['created_at', 'DESC']],
    });

    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({
      where: {
        id,
        organisation_id: req.user.orgId,
      },
      include: [{
        model: Team,
        through: { attributes: ['assigned_at'] },
      }],
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Failed to fetch employee', error: error.message });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, position, department } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    const employee = await Employee.create({
      organisation_id: req.user.orgId,
      first_name,
      last_name,
      email,
      phone,
      position,
      department,
    });

    // Log the action
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'employee_created',
      meta: {
        employeeId: employee.id,
        employeeName: `${first_name} ${last_name}`,
        email,
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Failed to create employee', error: error.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, position, department } = req.body;

    const employee = await Employee.findOne({
      where: {
        id,
        organisation_id: req.user.orgId,
      },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update fields
    if (first_name !== undefined) employee.first_name = first_name;
    if (last_name !== undefined) employee.last_name = last_name;
    if (email !== undefined) employee.email = email;
    if (phone !== undefined) employee.phone = phone;
    if (position !== undefined) employee.position = position;
    if (department !== undefined) employee.department = department;

    await employee.save();

    // Log the action
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'employee_updated',
      meta: {
        employeeId: employee.id,
        employeeName: `${employee.first_name} ${employee.last_name}`,
      },
    });

    res.json(employee);
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Failed to update employee', error: error.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({
      where: {
        id,
        organisation_id: req.user.orgId,
      },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const employeeName = `${employee.first_name} ${employee.last_name}`;

    await employee.destroy();

    // Log the action
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'employee_deleted',
      meta: {
        employeeId: id,
        employeeName,
      },
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Failed to delete employee', error: error.message });
  }
};
