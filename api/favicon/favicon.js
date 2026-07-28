const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false }
        });

        const [rows] = await connection.execute(
            'SELECT valor FROM config WHERE chave = ?',
            ['logo']
        );

        await connection.end();

        if (rows.length === 0 || !rows[0].valor) {
            return res.status(404).send('Favicon nao encontrado');
        }

        const logo = rows[0].valor;
        const base64Data = logo.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        res.set('Content-Type', 'image/png');
        res.send(buffer);
    } catch (error) {
        console.error('Erro no favicon:', error);
        res.status(500).send('Erro interno');
    }
};
