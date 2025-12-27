const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialControllers');

router.get('/:mascota_id', historialController.obtenerHistorial);
router.post('/', historialController.agregarEntrada);

module.exports = router;