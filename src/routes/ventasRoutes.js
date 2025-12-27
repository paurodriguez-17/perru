const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasControllers');

router.post('/', ventasController.procesarVenta);

module.exports = router;