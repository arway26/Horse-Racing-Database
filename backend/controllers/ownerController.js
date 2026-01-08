// ============================================================
// CONTROLLER: Owner
// Purpose: Request handlers for Owner operations
// ============================================================

const Owner = require('../models/Owner');

// ============================================================
// OWNER HANDLERS
// ============================================================

/**
 * Get owner details
 * GET /api/owners/:id
 */
const getOwner = async (req, res) => {
    try {
        const data = await Owner.getOwnerById(req.params.id);
        res.json(data);
    } catch (error) {
        console.error('Error fetching owner:', error);
        
        if (error.message === 'Owner not found') {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete owner using stored procedure
 * DELETE /api/owners/:id
 */
const deleteOwner = async (req, res) => {
    try {
        const result = await Owner.deleteOwnerById(req.params.id);
        res.json(result);
    } catch (error) {
        console.error('Error deleting owner:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getOwner,
    deleteOwner
};