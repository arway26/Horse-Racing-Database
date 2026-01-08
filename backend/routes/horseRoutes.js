// ============================================================
// ROUTES: Horse Operations
// Purpose: Define all endpoints related to horses
// ============================================================

const express = require('express');
const router = express.Router();
const horseController = require('../controllers/horseController');

// ============================================================
// HORSE ENDPOINTS
// ============================================================

// GET /api/horses/:id - Retrieve horse details
router.get('/:id', horseController.getHorse);

// PUT /api/horses/:id/stable - Move horse via stored procedure
router.put('/:id/stable', horseController.moveHorse);

module.exports = router;