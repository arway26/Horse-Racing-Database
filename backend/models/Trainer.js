// ============================================================
// MODEL: Trainer
// Purpose: Database operations for Trainer entity
// ============================================================

const pool = require('../config/database');

// ============================================================
// TRAINER OPERATIONS
// ============================================================

/**
 * Create a new trainer
 * @param {Object} trainer - Trainer details (trainerId, fname, lname, stableId)
 * @returns {Promise} - Success response
 */
const createTrainer = async (trainer) => {
    try {
        await pool.query(
            'INSERT INTO Trainer (trainerId, lname, fname, stableId) VALUES (?, ?, ?, ?)',
            [trainer.trainerId, trainer.lname, trainer.fname, trainer.stableId]
        );
        
        return {
            success: true,
            trainerId: trainer.trainerId
        };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            const err = new Error('Trainer ID already exists');
            err.code = 'DUPLICATE_ENTRY';
            throw err;
        }
        throw error;
    }
};

/**
 * Get trainer by ID with stable details
 * @param {String} trainerId - Trainer ID
 * @returns {Promise} - Trainer details
 */
const getTrainerById = async (trainerId) => {
    const [trainers] = await pool.query(
        `SELECT t.*, s.stableName, s.location
         FROM Trainer t
         JOIN Stable s ON t.stableId = s.stableId
         WHERE t.trainerId = ?`,
        [trainerId]
    );
    
    if (trainers.length === 0) {
        throw new Error('Trainer not found');
    }
    
    return trainers[0];
};

module.exports = {
    createTrainer,
    getTrainerById
};