const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Metodo nao permitido' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Nao autorizado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { currentPassword, newPassword } = req.body;

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false }
        });

        const [rows] = await connection.execute(
            'SELECT senha FROM cliente WHERE id = ?',
            [decoded.id]
        );

        if (rows.length === 0) {
            await connection.end();
            return res.status(404).json({ message: 'Usuario nao encontrado' });
        }

        const validPassword = await bcrypt.compare(currentPassword, rows[0].senha);
        if (!validPassword) {
            await connection.end();
            return res.status(401).json({ message: 'Senha atual incorreta' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await connection.execute(
            'UPDATE cliente SET senha = ?, data_alteracao = NOW() WHERE id = ?',
            [hashedPassword, decoded.id]
        );

        await connection.end();
        res.json({ message: 'Senha alterada com sucesso!' });
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
