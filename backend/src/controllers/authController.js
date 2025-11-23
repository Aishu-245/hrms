const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Organisation, User, Log } = require('../models');

// Register new organisation and admin user
exports.register = async (req, res) => {
  try {
    const { orgName, adminName, email, password } = req.body;

    // Validate input
    if (!orgName || !adminName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Create organisation
    const organisation = await Organisation.create({ name: orgName });

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await User.create({
      organisation_id: organisation.id,
      email,
      password_hash,
      name: adminName,
    });

    // Log the action
    await Log.create({
      organisation_id: organisation.id,
      user_id: user.id,
      action: 'organisation_created',
      meta: { orgName, adminEmail: email },
    });

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        orgId: organisation.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(201).json({
      message: 'Organisation and admin user created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organisationId: organisation.id,
        organisationName: organisation.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({
      where: { email },
      include: [{ model: Organisation }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Log the action
    await Log.create({
      organisation_id: user.organisation_id,
      user_id: user.id,
      action: 'user_login',
      meta: { email },
    });

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        orgId: user.organisation_id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organisationId: user.organisation_id,
        organisationName: user.Organisation.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    // Log the action
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'user_logout',
      meta: { email: req.user.email },
    });

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};

// Get current user info
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: [{ model: Organisation }],
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      organisationId: user.organisation_id,
      organisationName: user.Organisation.name,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
};
