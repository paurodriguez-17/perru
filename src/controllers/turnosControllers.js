const pool = require('../config/db');

const obtenerTurnos = async (req, res) => {
    try {
        const query = `
            SELECT 
                turnos.id, 
                turnos.fecha_turno, 
                turnos.estado,
                turnos.servicio,  /* <--- NUEVO */
                turnos.observaciones_extra,
                mascotas.nombre AS nombre_mascota,
                duenos.nombre_completo AS nombre_dueno,
                duenos.telefono AS telefono_dueno
            FROM turnos
            JOIN mascotas ON turnos.mascota_id = mascotas.id
            JOIN duenos ON mascotas.dueno_id = duenos.id
            ORDER BY turnos.fecha_turno ASC
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener turnos' });
    }
};

const crearTurno = async (req, res) => {
    const { mascota_id, fecha_turno, servicio, duracion_estimada_min, observaciones_extra } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO turnos (mascota_id, fecha_turno, servicio, duracion_estimada_min, observaciones_extra) VALUES (?, ?, ?, ?, ?)',
            [mascota_id, fecha_turno, servicio || 'Corte General', duracion_estimada_min || 60, observaciones_extra]
        );
        res.status(201).json({ id: result.insertId, message: 'Turno agendado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agendar turno' });
    }
};

const actualizarEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; // 'Finalizado' o 'Cancelado'

    try {
        await pool.query('UPDATE turnos SET estado = ? WHERE id = ?', [estado, id]);
        res.json({ message: `Turno actualizado a ${estado}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar turno' });
    }
};

module.exports = { obtenerTurnos, crearTurno, actualizarEstado };