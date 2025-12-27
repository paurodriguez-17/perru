const express = require('express');
const router = express.Router();
const turnosController = require('../controllers/turnosControllers');

router.get('/', turnosController.obtenerTurnos);
router.post('/', turnosController.crearTurno);
router.put('/:id', turnosController.actualizarEstado);

module.exports = router;