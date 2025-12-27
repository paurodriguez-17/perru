const pool = require('../config/db');

// 1. Obtener todas las mascotas con datos del dueño
const obtenerMascotas = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                mascotas.*, 
                duenos.nombre_completo AS nombre_dueno,
                duenos.telefono AS telefono_dueno,
                duenos.instagram_user
            FROM mascotas 
            JOIN duenos ON mascotas.dueno_id = duenos.id
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error' });
    }
};

// 2. Crear Mascota (Incluyendo frecuencia)
const crearMascota = async (req, res) => {
    const {
        dueno_id, nombre, raza, tamano, fecha_nacimiento, comportamiento,
        castrado, vacunas_al_dia, restriccion_alimentaria,
        fecha_ultima_desparasitacion, metodo_antipulgas, patologia,
        frecuencia_estimada // <--- NUEVO CAMPO
    } = req.body;

    try {
        await pool.query(
            `INSERT INTO mascotas (
                dueno_id, nombre, raza, tamano, fecha_nacimiento, comportamiento, 
                castrado, vacunas_al_dia, restriccion_alimentaria, 
                fecha_ultima_desparasitacion, metodo_antipulgas, patologia,
                frecuencia_estimada
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                dueno_id, nombre, raza, tamano,
                fecha_nacimiento || null,
                comportamiento,
                castrado ? 1 : 0,
                vacunas_al_dia ? 1 : 0,
                restriccion_alimentaria,
                fecha_ultima_desparasitacion || null,
                metodo_antipulgas,
                patologia,
                frecuencia_estimada || 30 // Si no viene nada, pone 30
            ]
        );
        res.status(201).json({ message: 'Mascota creada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando mascota' });
    }
};

// 3. Actualizar Mascota (Incluyendo frecuencia)
const actualizarMascota = async (req, res) => {
    const { id } = req.params;
    const {
        nombre, raza, tamano, fecha_nacimiento, comportamiento,
        castrado, vacunas_al_dia, restriccion_alimentaria,
        fecha_ultima_desparasitacion, metodo_antipulgas, patologia,
        frecuencia_estimada // <--- NUEVO CAMPO
    } = req.body;

    try {
        await pool.query(
            `UPDATE mascotas SET 
                nombre=?, raza=?, tamano=?, fecha_nacimiento=?, comportamiento=?, 
                castrado=?, vacunas_al_dia=?, restriccion_alimentaria=?, 
                fecha_ultima_desparasitacion=?, metodo_antipulgas=?, patologia=?,
                frecuencia_estimada=? 
            WHERE id=?`,
            [
                nombre, raza, tamano,
                fecha_nacimiento || null,
                comportamiento,
                castrado ? 1 : 0,
                vacunas_al_dia ? 1 : 0,
                restriccion_alimentaria,
                fecha_ultima_desparasitacion || null,
                metodo_antipulgas,
                patologia,
                frecuencia_estimada || 30, // Guardamos el nuevo valor
                id
            ]
        );
        res.json({ message: 'Actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando' });
    }
};

module.exports = { obtenerMascotas, crearMascota, actualizarMascota };