const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Nao autorizado' });
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

        const id = req.query.id;

        if (!id || isNaN(id)) {
            await connection.end();
            return res.status(400).json({ message: 'ID invalido' });
        }

        if (req.method === 'PUT') {
            const { numero_cartao, nome_cartao, bandeira, codigo_seguranca, validade } = req.body;
            await connection.execute(
                'UPDATE cartao SET numero_cartao = ?, nome_cartao = ?, bandeira = ?, codigo_seguranca = ?, validade = ? WHERE id = ? AND cliente_id = ?',
                [numero_cartao, nome_cartao, bandeira, codigo_seguranca, validade, id, decoded.id]
            );
            await connection.end();
            return res.json({ message: 'Cartao atualizado' });
        }

        if (req.method === 'DELETE') {
            await connection.execute(
                'DELETE FROM cartao WHERE id = ? AND cliente_id = ?',
                [id, decoded.id]
            );
            await connection.end();
            return res.json({ message: 'Cartao deletado' });
        }

        await connection.end();
        res.status(405).json({ message: 'Metodo nao permitido' });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ message: 'Erro interno', error: error.message });
    }
};
