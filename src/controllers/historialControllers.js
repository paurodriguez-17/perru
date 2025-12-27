const pool = require('../config/db');

// Obtener historial de una mascota
const obtenerHistorial = async (req, res) => {
    const { mascota_id } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM historial_medico WHERE mascota_id = ? ORDER BY fecha_visita DESC',
            [mascota_id]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al traer historial' });
    }
};

// Guardar nueva entrada (Corte, Shampoo, etc)
const agregarEntrada = async (req, res) => {
    const { mascota_id, fecha_visita, tipo_corte, shampoo, alza_utilizada, observaciones } = req.body;
    try {
        await pool.query(
            'INSERT INTO historial_medico (mascota_id, fecha_visita, tipo_corte, shampoo, alza_utilizada, observaciones) VALUES (?, ?, ?, ?, ?, ?)',
            [mascota_id, fecha_visita, tipo_corte, shampoo, alza_utilizada, observaciones]
        );
        res.status(201).json({ message: 'Historial guardado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al guardar historial' });
    }
};

module.exports = { obtenerHistorial, agregarEntrada };