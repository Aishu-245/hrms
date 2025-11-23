const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const authMiddleware = require('../middlewares/authMiddleware');

// All log routes require authentication
router.use(authMiddleware);

router.get('/', logController.getAllLogs);

module.exports = router;
