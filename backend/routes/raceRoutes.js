// ============================================================
// ROUTES: Race Operations
// Purpose: Define all endpoints related to races
// ============================================================

const express = require('express');
const router = express.Router();
const raceController = require('../controllers/raceController');

// ============================================================
// RACE ENDPOINTS
// ============================================================

// POST /api/races - Create race and associated results (transaction)
router.post('/', raceController.createRace);

// GET /api/races/:id - Retrieve race details and ordered results
router.get('/:id', raceController.getRace);

module.exports = router;