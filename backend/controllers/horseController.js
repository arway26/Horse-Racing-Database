// ============================================================
// CONTROLLER: Horse
// Purpose: Request handlers for Horse operations
// ============================================================

const Horse = require('../models/Horse');

// ============================================================
// HORSE HANDLERS
// ============================================================

/**
 * Get horse details
 * GET /api/horses/:id
 */
const getHorse = async (req, res) => {
    try {
        const horse = await Horse.getHorseById(req.params.id);
        res.json(horse);
    } catch (error) {
        console.error('Error fetching horse:', error);
        
        if (error.message === 'Horse not found') {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ error: error.message });
    }
};

/**
 * Move horse to new stable
 * PUT /api/horses/:id/stable
 */
const moveHorse = async (req, res) => {
    const { newStableId } = req.body;
    
    try {
        const result = await Horse.moveHorseToStable(req.params.id, newStableId);
        res.json(result);
    } catch (error) {
        console.error('Error moving horse:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getHorse,
    moveHorse
};