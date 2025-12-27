const { createPool } = require('mysql2/promise');
require('dotenv').config();

const pool = createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Coco1406.',
    database: process.env.DB_NAME || 'perruqueria',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true 
});

module.exports = pool;