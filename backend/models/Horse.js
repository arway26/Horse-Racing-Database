// ============================================================
// MODEL: Horse
// Purpose: Database operations for Horse entity
// ============================================================

const pool = require('../config/database');

// ============================================================
// HORSE OPERATIONS
// ============================================================

/**
 * Get horse by ID with stable details
 * @param {String} horseId - Horse ID
 * @returns {Promise} - Horse details
 */
const getHorseById = async (horseId) => {
    const [horses] = await pool.query(
        `SELECT h.*, s.stableName, s.location, s.colors
         FROM Horse h
         JOIN Stable s ON h.stableId = s.stableId
         WHERE h.horseId = ?`,
        [horseId]
    );
    
    if (horses.length === 0) {
        throw new Error('Horse not found');
    }
    
    return horses[0];
};

/**
 * Move horse to new stable using stored procedure
 * @param {String} horseId - Horse ID
 * @param {String} newStableId - New stable ID
 * @returns {Promise} - Move result
 */
const moveHorseToStable = async (horseId, newStableId) => {
    const connection = await pool.getConnection();
    
    try {
        const [result] = await connection.query(
            'CALL MoveHorseToStable(?, ?)',
            [horseId, newStableId]
        );
        
        const moveResult = result[0][0];
        
        if (moveResult.Status === 'Success') {
            return {
                success: true,
                message: moveResult.Message,
                details: moveResult
            };
        } else {
            throw new Error(moveResult.ErrorMessage || moveResult.Message);
        }
    } finally {
        connection.release();
    }
};

module.exports = {
    getHorseById,
    moveHorseToStable
};