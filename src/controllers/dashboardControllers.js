const pool = require('../config/db');

const obtenerResumen = async (req, res) => {
    try {
        // 1. Turnos Hoy (Igual que antes)
        const [turnosHoy] = await pool.query("SELECT COUNT(*) as total FROM turnos WHERE DATE(fecha_turno) = CURDATE() AND estado = 'Pendiente'");

        // 2. Ingresos Hoy (Igual que antes)
        const [cajaHoy] = await pool.query("SELECT SUM(monto) as total FROM caja WHERE tipo = 'Ingreso' AND DATE(fecha) = CURDATE()");

        // 3. Alertas Stock (Igual que antes)
        const [stockBajo] = await pool.query("SELECT COUNT(*) as total FROM productos WHERE stock <= stock_minimo");

        // 4. Próximos Turnos (Igual que antes)
        const [proximos] = await pool.query(`
            SELECT t.id, t.fecha_turno, t.servicio, m.nombre as mascota, m.raza, d.nombre_completo as dueno, d.telefono
            FROM turnos t
            JOIN mascotas m ON t.mascota_id = m.id
            JOIN duenos d ON m.dueno_id = d.id
            WHERE t.fecha_turno >= NOW() AND t.estado = 'Pendiente'
            ORDER BY t.fecha_turno ASC LIMIT 5
        `);

        // 5. Stock Bajo Lista (Igual que antes)
        const [productosFaltantes] = await pool.query("SELECT nombre, stock, stock_minimo FROM productos WHERE stock <= stock_minimo ORDER BY stock ASC LIMIT 5");

        // 6. 🔥 NUEVO: Clientes para Recordar (Re-compra)
        // Buscamos la última fecha de turno FINALIZADO de cada mascota
        // Y calculamos si pasaron más días que su 'frecuencia_estimada'
        const [clientesRecordar] = await pool.query(`
            SELECT 
                m.nombre as mascota, 
                d.nombre_completo as dueno, 
                d.telefono,
                MAX(t.fecha_turno) as ultima_visita,
                m.frecuencia_estimada,
                DATEDIFF(NOW(), MAX(t.fecha_turno)) as dias_pasados
            FROM turnos t
            JOIN mascotas m ON t.mascota_id = m.id
            JOIN duenos d ON m.dueno_id = d.id
            WHERE t.estado = 'Finalizado'
            GROUP BY m.id
            HAVING dias_pasados >= m.frecuencia_estimada
            ORDER BY dias_pasados DESC
            LIMIT 10
        `);

        res.json({
            turnosHoy: turnosHoy[0].total || 0,
            ingresosHoy: cajaHoy[0].total || 0,
            alertasStock: stockBajo[0].total || 0,
            proximosTurnos: proximos,
            listaStockBajo: productosFaltantes,
            clientesRecordar: clientesRecordar // <--- Enviamos la nueva lista
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo resumen' });
    }
};

module.exports = { obtenerResumen };