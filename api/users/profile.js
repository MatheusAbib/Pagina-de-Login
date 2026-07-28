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

        const [rows] = await connection.execute(
            'SELECT id, nome, email, genero, data_nascimento, cpf, telefone, foto FROM cliente WHERE id = ?',
            [decoded.id]
        );

        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usu?rio n?o encontrado' });
        }

        if (req.method === 'PUT') {
            const { nome, email, genero, data_nascimento, cpf, telefone } = req.body;
            const conn = await mysql.createConnection({
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                ssl: { rejectUnauthorized: false }
            });
            await conn.execute(
                'UPDATE cliente SET nome = ?, email = ?, genero = ?, data_nascimento = ?, cpf = ?, telefone = ?, data_alteracao = NOW() WHERE id = ?',
                [nome, email, genero, data_nascimento, cpf, telefone, decoded.id]
            );
            await conn.end();
            return res.json({ message: 'Perfil atualizado' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno' });
    }
};
