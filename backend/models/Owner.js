// ============================================================
// MODEL: Owner
// Purpose: Database operations for Owner entity
// ============================================================

const pool = require('../config/database');

// ============================================================
// OWNER OPERATIONS
// ============================================================

/**
 * Get owner by ID with owned horses
 * @param {String} ownerId - Owner ID
 * @returns {Promise} - Owner details with horses
 */
const getOwnerById = async (ownerId) => {
    const [owners] = await pool.query(
        'SELECT * FROM Owner WHERE ownerId = ?',
        [ownerId]
    );
    
    if (owners.length === 0) {
        throw new Error('Owner not found');
    }
    
    const [horses] = await pool.query(
        `SELECT h.horseId, h.horseName, h.age, h.gender, s.stableName, s.location
         FROM Owns o
         JOIN Horse h ON o.horseId = h.horseId
         JOIN Stable s ON h.stableId = s.stableId
         WHERE o.ownerId = ?`,
        [ownerId]
    );
    
    return {
        owner: owners[0],
        horses: horses
    };
};

/**
 * Delete owner using stored procedure
 * @param {String} ownerId - Owner ID
 * @returns {Promise} - Deletion result
 */
const deleteOwnerById = async (ownerId) => {
    const connection = await pool.getConnection();
    
    try {
        const [result] = await connection.query(
            'CALL DeleteOwnerAndRelatedInfo(?)',
            [ownerId]
        );
        
        const deleteResult = result[0][0];
        
        if (deleteResult.Status === 'Success') {
            return {
                success: true,
                message: deleteResult.Message,
                details: deleteResult
            };
        } else {
            throw new Error(deleteResult.ErrorMessage || deleteResult.Message);
        }
    } finally {
        connection.release();
    }
};

module.exports = {
    getOwnerById,
    deleteOwnerById
};