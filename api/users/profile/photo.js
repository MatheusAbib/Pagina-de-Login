const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'M?todo n?o permitido' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'N?o autorizado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { foto } = req.body;

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false }
        });

        await connection.execute(
            'UPDATE cliente SET foto = ?, data_alteracao = NOW() WHERE id = ?',
            [foto || null, decoded.id]
        );

        await connection.end();
        res.json({ message: 'Foto atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar foto' });
    }
};
