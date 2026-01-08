// ============================================================
// ROUTES: Owner Operations
// Purpose: Define all endpoints related to owners
// ============================================================

const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');

// ============================================================
// OWNER ENDPOINTS
// ============================================================

// GET /api/owners/:id - Retrieve owner and owned horses
router.get('/:id', ownerController.getOwner);

// DELETE /api/owners/:id - Delete owner using stored procedure
router.delete('/:id', ownerController.deleteOwner);

module.exports = router;