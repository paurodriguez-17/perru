const pool = require('../config/db');

// 1. Obtener todos los dueños
const obtenerDuenos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM duenos');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener dueños' });
    }
};

// Crear dueño (Ya lo tenías, asegúrate que sea así)
const crearDueno = async (req, res) => {
    const { nombre_completo, telefono, instagram_user } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO duenos (nombre_completo, telefono, instagram_user) VALUES (?, ?, ?)',
            [nombre_completo, telefono, instagram_user]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear dueño' });
    }
};

// 👇 NUEVO: Actualizar dueño
const actualizarDueno = async (req, res) => {
    const { id } = req.params;
    const { nombre_completo, telefono, instagram_user } = req.body;
    try {
        await pool.query(
            'UPDATE duenos SET nombre_completo = ?, telefono = ?, instagram_user = ? WHERE id = ?',
            [nombre_completo, telefono, instagram_user, id]
        );
        res.json({ message: 'Dueño actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando dueño' });
    }
};

module.exports = { obtenerDuenos, crearDueno, actualizarDueno };
