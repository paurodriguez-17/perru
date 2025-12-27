const express = require('express');
const router = express.Router();
const cajaController = require('../controllers/cajaControllers');

router.get('/', cajaController.obtenerMovimientos);
router.post('/', cajaController.registrarMovimiento);

module.exports = router;