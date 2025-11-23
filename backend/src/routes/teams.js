const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authMiddleware = require('../middlewares/authMiddleware');

// All team routes require authentication
router.use(authMiddleware);

router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.post('/', teamController.createTeam);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

// Team assignment routes
router.post('/:teamId/assign', teamController.assignEmployeeToTeam);
router.post('/:teamId/unassign', teamController.unassignEmployeeFromTeam);

module.exports = router;
