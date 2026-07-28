const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'N?o autorizado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false }
        });

        const urlParts = req.url.split('/');
        const id = urlParts[urlParts.length - 1];

        if (req.method === 'GET' && !id) {
            const [rows] = await connection.execute(
                'SELECT * FROM cartao WHERE cliente_id = ?',
                [decoded.id]
            );
            await connection.end();
            return res.json(rows);
        }

        if (req.method === 'POST') {
            const { numero_cartao, nome_cartao, bandeira, codigo_seguranca, validade } = req.body;
            const [result] = await connection.execute(
                'INSERT INTO cartao (numero_cartao, nome_cartao, bandeira, codigo_seguranca, validade, cliente_id) VALUES (?, ?, ?, ?, ?, ?)',
                [numero_cartao, nome_cartao, bandeira, codigo_seguranca, validade, decoded.id]
            );
            await connection.end();
            return res.status(201).json({ id: result.insertId });
        }

        if (req.method === 'PUT' && id) {
            const { numero_cartao, nome_cartao, bandeira, codigo_seguranca, validade } = req.body;
            await connection.execute(
                'UPDATE cartao SET numero_cartao = ?, nome_cartao = ?, bandeira = ?, codigo_seguranca = ?, validade = ? WHERE id = ? AND cliente_id = ?',
                [numero_cartao, nome_cartao, bandeira, codigo_seguranca, validade, id, decoded.id]
            );
            await connection.end();
            return res.json({ message: 'Cart?o atualizado' });
        }

        if (req.method === 'DELETE' && id) {
            await connection.execute(
                'DELETE FROM cartao WHERE id = ? AND cliente_id = ?',
                [id, decoded.id]
            );
            await connection.end();
            return res.json({ message: 'Cart?o deletado' });
        }

        await connection.end();
        res.status(405).json({ message: 'M?todo n?o permitido' });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno' });
    }
};
