// ============================================================
// CONTROLLER: Trainer
// Purpose: Request handlers for Trainer operations
// ============================================================

const Trainer = require('../models/Trainer');

// ============================================================
// TRAINER HANDLERS
// ============================================================

/**
 * Create a new trainer
 * POST /api/trainers
 */
const createTrainer = async (req, res) => {
    const { trainerId, fname, lname, stableId } = req.body;
    
    try {
        const result = await Trainer.createTrainer({ trainerId, fname, lname, stableId });
        
        res.json({
            success: true,
            message: 'Trainer approved successfully',
            trainerId: result.trainerId
        });
    } catch (error) {
        console.error('Error adding trainer:', error);
        
        if (error.code === 'DUPLICATE_ENTRY') {
            return res.status(400).json({
                success: false,
                error: 'Trainer ID already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Get trainer details
 * GET /api/trainers/:id
 */
const getTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.getTrainerById(req.params.id);
        res.json(trainer);
    } catch (error) {
        console.error('Error fetching trainer:', error);
        
        if (error.message === 'Trainer not found') {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTrainer,
    getTrainer
};