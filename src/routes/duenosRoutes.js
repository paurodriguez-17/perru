const express = require('express');
const router = express.Router();
const duenosController = require('../controllers/duenosControllers');

router.get('/', duenosController.obtenerDuenos);
router.post('/', duenosController.crearDueno);
router.put('/:id', duenosController.actualizarDueno);

module.exports = router;