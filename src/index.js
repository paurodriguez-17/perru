const express = require('express');
const cors = require('cors');
const path = require('path');
const envPath = path.join(process.cwd(), '.env');

console.log('📂 Buscando archivo .env en:', envPath);
const result = require('dotenv').config({ path: envPath });

// Importar rutas
const duenosRoutes = require('./routes/duenosRoutes');
const mascotasRoutes = require('./routes/mascotasRoutes');
const turnosRoutes = require('./routes/turnosRoutes');
const cajaRoutes = require('./routes/cajaRoutes');
const historialRoutes = require('./routes/historialRoutes'); // <--- IMPORTANTE
const productosRoutes = require('./routes/productosRoutes');
const ventasRoutes = require('./routes/ventasRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = 4000;

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/duenos', duenosRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api/caja', cajaRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/dashboard', dashboardRoutes);


app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});