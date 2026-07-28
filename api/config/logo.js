const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const [rows] = await connection.execute(
            'SELECT valor FROM config WHERE chave = ?',
            ['logo']
        );
        res.json({ logo: rows.length > 0 ? rows[0].valor : '' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar logo' });
    } finally {
        await connection.end();
    }
};
