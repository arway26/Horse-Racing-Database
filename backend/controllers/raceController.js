// ============================================================
// CONTROLLER: Race
// Purpose: Request handlers for Race operations
// ============================================================

const Race = require('../models/Race');

// ============================================================
// RACE HANDLERS
// ============================================================

/**
 * Create a new race with results
 * POST /api/races
 */
const createRace = async (req, res) => {
    const { race, results } = req.body;
    
    try {
        const result = await Race.createRaceWithResults(race, results);
        
        res.json({
            success: true,
            message: 'Race added successfully',
            raceId: result.raceId
        });
    } catch (error) {
        console.error('Error adding race:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Get race by ID
 * GET /api/races/:id
 */
const getRace = async (req, res) => {
    try {
        const data = await Race.getRaceById(req.params.id);
        res.json(data);
    } catch (error) {
        console.error('Error fetching race:', error);
        
        if (error.message === 'Race not found') {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createRace,
    getRace
};