const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'M?todo n?o permitido' });
    }

    const { nome, email, genero, data_nascimento, cpf, telefone, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Nome, email e senha s?o obrigat?rios' });
    }

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const [existing] = await connection.execute(
            'SELECT id FROM cliente WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email j? cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        await connection.execute(
            `INSERT INTO cliente 
            (nome, email, genero, data_nascimento, cpf, telefone, senha, data_cadastro) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [nome, email, genero, data_nascimento, cpf, telefone, hashedPassword]
        );

        res.status(201).json({ message: 'Usu?rio cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    } finally {
        await connection.end();
    }
};
