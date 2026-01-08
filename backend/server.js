// ============================================================
// Horse Racing Database - Backend API Server
// Purpose: Express API for managing races, owners, horses, and trainers (MySQL)
// Architecture: Separated routes, controllers, and models
// ============================================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// ============================================================
// IMPORT ROUTES
// ============================================================
const raceRoutes = require('./routes/raceRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const horseRoutes = require('./routes/horseRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const utilityRoutes = require('./routes/utilityRoutes');

// ============================================================
// EXPRESS APP SETUP
// ============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// ============================================================
// API ROUTES
// ============================================================
app.use('/api/races', raceRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/horses', horseRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api', utilityRoutes);

// ============================================================
// FRONTEND ROUTE
// ============================================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// ============================================================
// ERROR HANDLERS
// ============================================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
    console.log('╔═══════════════════════════════════════════╗');
    console.log('  Horse Racing Database API Server');
    console.log('╠═══════════════════════════════════════════╣');
    console.log(`  Server running on port ${PORT}`);
    console.log(`  API URL: http://localhost:${PORT}`);
    console.log(`  Health check: http://localhost:${PORT}/api/health`);
    console.log('╠═══════════════════════════════════════════╣');
    console.log('\n  Available Endpoints:');
    console.log('  POST   /api/races           - Add race with results');
    console.log('  GET    /api/races/:id       - Get race details');
    console.log('  GET    /api/owners/:id      - Get owner details');
    console.log('  DELETE /api/owners/:id      - Delete owner');
    console.log('  GET    /api/horses/:id      - Get horse details');
    console.log('  PUT    /api/horses/:id/stable - Move horse');
    console.log('  POST   /api/trainers        - Add trainer');
    console.log('  GET    /api/trainers/:id    - Get trainer details');
    console.log('  GET    /api/stables         - List all stables');
    console.log('  GET    /api/tracks          - List all tracks');
    console.log('  GET    /api/archive/horses  - View deleted horses');
    console.log('╚═══════════════════════════════════════════╝\n');
});

module.exports = app;