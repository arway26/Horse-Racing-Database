// ============================================================
// MODEL: Race
// Purpose: Database operations for Race entity
// ============================================================
// Explain to me how and where we implemented this function: Add a new race with the results of the race. SQL part not frontend or java script
const pool = require('../config/database');

// ============================================================
// RACE OPERATIONS
// ============================================================

/**
 * Create a new race with results (transaction)
 * @param {Object} race - Race details
 * @param {Array} results - Array of race results
 * @returns {Promise} - Success/error response
 */
const createRaceWithResults = async (race, results) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Insert race
        await connection.query(
            'INSERT INTO Race (raceId, raceName, trackName, raceDate, raceTime) VALUES (?, ?, ?, ?, ?)',
            [race.raceId, race.raceName, race.trackName, race.raceDate, race.raceTime]
        );
        
        // Insert race results
        for (const result of results) {
            await connection.query(
                'INSERT INTO RaceResults (raceId, horseId, results, prize) VALUES (?, ?, ?, ?)',
                [race.raceId, result.horseId, result.result, result.prize]
            );
        }
        
        await connection.commit();
        return { success: true, raceId: race.raceId };
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

/**
 * Get race by ID with track and results
 * @param {String} raceId - Race ID
 * @returns {Promise} - Race details with results
 */
const getRaceById = async (raceId) => {
    const [races] = await pool.query(
        `SELECT r.*, t.location, t.length 
         FROM Race r 
         JOIN Track t ON r.trackName = t.trackName 
         WHERE r.raceId = ?`,
        [raceId]
    );
    
    if (races.length === 0) {
        throw new Error('Race not found');
    }
    
    const [results] = await pool.query(
        `SELECT rr.*, h.horseName 
         FROM RaceResults rr 
         JOIN Horse h ON rr.horseId = h.horseId 
         WHERE rr.raceId = ?
         ORDER BY 
            CASE rr.results
                WHEN 'first' THEN 1
                WHEN 'second' THEN 2
                WHEN 'third' THEN 3
                WHEN 'fourth' THEN 4
                ELSE 5
            END`,
        [raceId]
    );
    
    return {
        race: races[0],
        results: results
    };
};

module.exports = {
    createRaceWithResults,
    getRaceById
};