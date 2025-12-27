const pool = require('../config/db');

const procesarVenta = async (req, res) => {
    const { items, total, medio_pago } = req.body;
    // items es un array: [{ id, nombre, cantidad, precio }]

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'El carrito está vacío' });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Restar Stock de cada producto
        for (const item of items) {
            await connection.query(
                'UPDATE productos SET stock = stock - ? WHERE id = ?',
                [item.cantidad, item.id]
            );
        }

        // 2. Crear descripción para la caja (Ej: "Venta: 2x Correa, 1x Alimento")
        const descripcion = `Venta: ${items.map(i => `${i.cantidad}x ${i.nombre}`).join(', ')}`;

        // Cortar descripción si es muy larga para que no de error
        const descripcionCorta = descripcion.length > 250 ? descripcion.substring(0, 247) + '...' : descripcion;

        // 3. Registrar Ingreso en CAJA (Sector PetShop)
        await connection.query(
            'INSERT INTO caja (tipo, origen, monto, concepto, medio_pago, fecha) VALUES (?, ?, ?, ?, ?, NOW())',
            ['Ingreso', 'PetShop', total, descripcionCorta, medio_pago || 'Efectivo']
        );

        await connection.commit();
        res.json({ message: 'Venta registrada con éxito' });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error al procesar la venta' });
    } finally {
        connection.release();
    }
};

module.exports = { procesarVenta };