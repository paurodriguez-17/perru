const pool = require('../config/db');

// Listar todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos ORDER BY nombre ASC');
        res.json(rows);
    } catch (error) { console.error(error); res.status(500).json({ message: 'Error' }); }
};

// Crear nuevo producto
const crearProducto = async (req, res) => {
    const { codigo, nombre, categoria, precio, stock } = req.body;
    try {
        await pool.query(
            'INSERT INTO productos (codigo, nombre, categoria, precio, stock) VALUES (?, ?, ?, ?, ?)',
            [codigo, nombre, categoria, precio, stock]
        );
        res.status(201).json({ message: 'Producto creado' });
    } catch (error) { console.error(error); res.status(500).json({ message: 'Error' }); }
};

// Editar producto (Stock o Precio)
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { codigo, nombre, categoria, precio, stock } = req.body;
    try {
        await pool.query(
            'UPDATE productos SET codigo=?, nombre=?, categoria=?, precio=?, stock=? WHERE id=?',
            [codigo, nombre, categoria, precio, stock, id]
        );
        res.json({ message: 'Producto actualizado' });
    } catch (error) { console.error(error); res.status(500).json({ message: 'Error' }); }
};

// Eliminar
const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM productos WHERE id = ?', [id]);
        res.json({ message: 'Producto eliminado' });
    } catch (error) { console.error(error); res.status(500).json({ message: 'Error' }); }
};

module.exports = { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto };