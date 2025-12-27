const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardControllers');

// Ruta GET /api/dashboard
router.get('/', dashboardController.obtenerResumen);

module.exports = router;