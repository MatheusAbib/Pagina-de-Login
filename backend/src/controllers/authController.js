const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        console.log('Dados recebidos no backend:', req.body);

        const { nome, email, genero, data_nascimento, cpf, telefone, senha } = req.body;

        if (!nome || !email || !senha) {
            console.log('Campos obrigatórios faltando!');
            return res.status(400).json({ message: 'Nome, email e senha são obrigatórios!' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já cadastrado!' });
        }

        const existingCpf = await User.findOne({ where: { cpf } });
        if (existingCpf) {
            return res.status(400).json({ message: 'CPF já cadastrado!' });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const user = await User.create({
            nome,
            email,
            genero: genero || 'Não informado',
            data_nascimento: data_nascimento || '1900-01-01',
            cpf: cpf || '000.000.000-00',
            telefone: telefone || '(00) 00000-0000',
            senha: hashedPassword,
            data_cadastro: new Date()
        });

        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erro detalhado no registro:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({
            message: 'Erro ao cadastrar usuário!',
            error: error.message,
            stack: error.stack
        });
    }
};

exports.login = async (req, res) => {
    try {
        console.log('Tentativa de login:', req.body);

        const { email, senha } = req.body;

        if (!email || !senha) {
            console.log('Email ou senha não fornecidos');
            return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('Usuário não encontrado:', email);
            return res.status(401).json({ message: 'Email ou senha inválidos!' });
        }

        console.log('Usuário encontrado:', user.email);
        console.log('Senha no banco:', user.senha);

        const validPassword = await bcrypt.compare(senha, user.senha);
        console.log('Senha válida?', validPassword);

        if (!validPassword) {
            return res.status(401).json({ message: 'Email ou senha inválidos!' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                genero: user.genero,
                data_nascimento: user.data_nascimento,
                cpf: user.cpf,
                telefone: user.telefone
            }
        });
    } catch (error) {
        console.error('Erro detalhado no login:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({
            message: 'Erro ao fazer login!',
            error: error.message
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email é obrigatório!' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        const resetToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;

        console.log('📧 Link de reset:', resetLink);

        res.json({
            message: 'Link de recuperação enviado para o email!',
            token: resetToken,
            resetLink
        });
    } catch (error) {
        console.error('Erro ao recuperar senha:', error);
        res.status(500).json({ message: 'Erro ao recuperar senha!' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token e nova senha são obrigatórios!' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({
            senha: hashedPassword,
            data_alteracao: new Date()
        });

        res.json({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido!' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado!' });
        }
        res.status(500).json({ message: 'Erro ao redefinir senha!' });
    }
};
