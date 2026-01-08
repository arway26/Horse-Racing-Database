// ============================================================
// CONTROLLER: Utility
// Purpose: Request handlers for utility operations (stables, tracks, archives, health)
// ============================================================

const Utility = require('../models/Utility');
const pool = require('../config/database');

// ============================================================
// UTILITY HANDLERS
// ============================================================

/**
 * Get all stables
 * GET /api/stables
 */
const getStables = async (req, res) => {
    try {
        const stables = await Utility.getAllStables();
        res.json(stables);
    } catch (error) {
        console.error('Error fetching stables:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get all tracks
 * GET /api/tracks
 */
const getTracks = async (req, res) => {
    try {
        const tracks = await Utility.getAllTracks();
        res.json(tracks);
    } catch (error) {
        console.error('Error fetching tracks:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get deleted/archived horses
 * GET /api/archive/horses
 */
const getArchivedHorses = async (req, res) => {
    try {
        const archived = await Utility.getArchivedHorses();
        res.json(archived);
    } catch (error) {
        console.error('Error fetching archived horses:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Health check endpoint
 * GET /api/health
 */
const healthCheck = async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message
        });
    }
};

module.exports = {
    getStables,
    getTracks,
    getArchivedHorses,
    healthCheck
};