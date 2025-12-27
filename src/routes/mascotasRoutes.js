const express = require('express');
const router = express.Router();
const mascotasController = require('../controllers/mascotasControllers');

router.get('/', mascotasController.obtenerMascotas);
router.post('/', mascotasController.crearMascota);
router.put('/:id', mascotasController.actualizarMascota);

module.exports = router;