// ============================================================
// ROUTES: Utility Operations
// Purpose: Define endpoints for stables, tracks, archives, and health checks
// ============================================================

const express = require('express');
const router = express.Router();
const utilityController = require('../controllers/utilityController');

// ============================================================
// UTILITY ENDPOINTS
// ============================================================

// GET /api/stables - List all stables
router.get('/stables', utilityController.getStables);

// GET /api/tracks - List all tracks
router.get('/tracks', utilityController.getTracks);

// GET /api/archive/horses - View deleted horses
router.get('/archive/horses', utilityController.getArchivedHorses);

// GET /api/health - Health check
router.get('/health', utilityController.healthCheck);

module.exports = router;