const express = require('express');
const router = express.Router();
const turnosController = require('../controllers/turnosControllers');

router.get('/', turnosController.obtenerTurnos);
router.post('/', turnosController.crearTurno);
router.put('/:id', turnosController.actualizarEstado); // Solo cambia estado (Cancelar/Finalizar)

// Nuevas rutas
router.put('/:id/editar', turnosController.editarTurno); // Cambia fecha y datos
router.delete('/:id', turnosController.eliminarTurno);   // Elimina

module.exports = router;