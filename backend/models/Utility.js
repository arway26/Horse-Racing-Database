// ============================================================
// MODEL: Utility
// Purpose: Database operations for stables, tracks, and archives
// ============================================================

const pool = require('../config/database');

// ============================================================
// UTILITY OPERATIONS
// ============================================================

/**
 * Get all stables
 * @returns {Promise} - List of stables
 */
const getAllStables = async () => {
    const [stables] = await pool.query(
        'SELECT * FROM Stable ORDER BY stableName'
    );
    return stables;
};

/**
 * Get all tracks
 * @returns {Promise} - List of tracks
 */
const getAllTracks = async () => {
    const [tracks] = await pool.query(
        'SELECT * FROM Track ORDER BY trackName'
    );
    return tracks;
};

/**
 * Get archived/deleted horses
 * @returns {Promise} - List of archived horses
 */
const getArchivedHorses = async () => {
    const [archived] = await pool.query(
        'SELECT * FROM old_info ORDER BY deletedAt DESC LIMIT 50'
    );
    return archived;
};

module.exports = {
    getAllStables,
    getAllTracks,
    getArchivedHorses
};