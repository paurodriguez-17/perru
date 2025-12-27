const pool = require('../config/db');

// 1. Ver movimientos (Historial de caja)
const obtenerMovimientos = async (req, res) => {
    try {
        const query = `
            SELECT * FROM caja 
            ORDER BY fecha DESC
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener movimientos' });
    }
};

// 2. Registrar un nuevo movimiento (Ingreso o Gasto)
const registrarMovimiento = async (req, res) => {
    const { tipo, origen, concepto, monto, medio_pago, turno_id } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO caja (tipo, origen, concepto, monto, medio_pago, turno_id) VALUES (?, ?, ?, ?, ?, ?)',
            [tipo, origen, concepto, monto, medio_pago, turno_id || null]
        );
        
        // Si el movimiento viene de un turno, podríamos marcar el turno como "pagado" aquí también (Opcional para el futuro)
        
        res.status(201).json({ id: result.insertId, message: 'Movimiento registrado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar movimiento' });
    }
};

module.exports = { obtenerMovimientos, registrarMovimiento };