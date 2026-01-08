// ============================================================
// ROUTES: Trainer Operations
// Purpose: Define all endpoints related to trainers
// ============================================================

const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');

// ============================================================
// TRAINER ENDPOINTS
// ============================================================

// POST /api/trainers - Approve/add a trainer
router.post('/', trainerController.createTrainer);

// GET /api/trainers/:id - Retrieve trainer details
router.get('/:id', trainerController.getTrainer);

module.exports = router;