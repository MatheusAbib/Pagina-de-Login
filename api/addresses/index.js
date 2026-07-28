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
                'SELECT * FROM endereco WHERE cliente_id = ?',
                [decoded.id]
            );
            await connection.end();
            return res.json(rows);
        }

        if (req.method === 'POST') {
            const { endereco_entrega, numero, bairro, cep, cidade, estado, pais, tipo_residencia, descricao_endereco } = req.body;
            const [result] = await connection.execute(
                'INSERT INTO endereco (endereco_entrega, numero, bairro, cep, cidade, estado, pais, tipo_residencia, descricao_endereco, cliente_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [endereco_entrega, numero, bairro, cep, cidade, estado, pais, tipo_residencia, descricao_endereco, decoded.id]
            );
            await connection.end();
            return res.status(201).json({ id: result.insertId });
        }

        if (req.method === 'PUT' && id) {
            const { endereco_entrega, numero, bairro, cep, cidade, estado, pais, tipo_residencia, descricao_endereco } = req.body;
            await connection.execute(
                'UPDATE endereco SET endereco_entrega = ?, numero = ?, bairro = ?, cep = ?, cidade = ?, estado = ?, pais = ?, tipo_residencia = ?, descricao_endereco = ? WHERE id = ? AND cliente_id = ?',
                [endereco_entrega, numero, bairro, cep, cidade, estado, pais, tipo_residencia, descricao_endereco, id, decoded.id]
            );
            await connection.end();
            return res.json({ message: 'Endere?o atualizado' });
        }

        if (req.method === 'DELETE' && id) {
            await connection.execute(
                'DELETE FROM endereco WHERE id = ? AND cliente_id = ?',
                [id, decoded.id]
            );
            await connection.end();
            return res.json({ message: 'Endere?o deletado' });
        }

        await connection.end();
        res.status(405).json({ message: 'M?todo n?o permitido' });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno' });
    }
};
