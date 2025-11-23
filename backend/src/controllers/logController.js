const { Log, User } = require('../models');

// Get all logs for the organisation
exports.getAllLogs = async (req, res) => {
  try {
    const { limit = 100, offset = 0, action } = req.query;

    const whereClause = { organisation_id: req.user.orgId };
    
    if (action) {
      whereClause.action = action;
    }

    const logs = await Log.findAll({
      where: whereClause,
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const total = await Log.count({ where: whereClause });

    res.json({
      logs,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ message: 'Failed to fetch logs', error: error.message });
  }
};
