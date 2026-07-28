const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Address = require('../models/Address');
const Card = require('../models/Card');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['senha'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários!' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['senha'] },
            include: [
                { model: Address },
                { model: Card }
            ]
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário!' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: { exclude: ['senha'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar perfil!' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }
        if (req.userId !== parseInt(req.params.id)) {
            return res.status(403).json({ message: 'Sem permissão!' });
        }
        await user.update({
            nome: req.body.nome,
            email: req.body.email,
            genero: req.body.genero,
            data_nascimento: req.body.data_nascimento,
            cpf: req.body.cpf,
            telefone: req.body.telefone,
            foto: req.body.foto || null,
            data_alteracao: new Date()
        });
        res.json({
            message: 'Usuário atualizado com sucesso!',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                genero: user.genero,
                data_nascimento: user.data_nascimento,
                cpf: user.cpf,
                telefone: user.telefone,
                foto: user.foto
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário!' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }
        if (req.userId !== parseInt(req.params.id)) {
            return res.status(403).json({ message: 'Sem permissão!' });
        }
        await user.destroy();
        res.json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar usuário!' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }
        await user.update({
            nome: req.body.nome,
            email: req.body.email,
            genero: req.body.genero,
            data_nascimento: req.body.data_nascimento,
            cpf: req.body.cpf,
            telefone: req.body.telefone,
            foto: req.body.foto || user.foto,
            data_alteracao: new Date()
        });
        res.json({
            message: 'Perfil atualizado com sucesso!',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                genero: user.genero,
                data_nascimento: user.data_nascimento,
                cpf: user.cpf,
                telefone: user.telefone,
                foto: user.foto
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar perfil!' });
    }
};

exports.updateProfilePhoto = async (req, res) => {
    try {
        const { foto } = req.body;
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        await user.update({
            foto: foto || null,
            data_alteracao: new Date()
        });

        res.json({
            message: 'Foto atualizada com sucesso!',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                genero: user.genero,
                data_nascimento: user.data_nascimento,
                cpf: user.cpf,
                telefone: user.telefone,
                foto: user.foto
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar foto:', error);
        res.status(500).json({ message: 'Erro ao atualizar foto!' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        const validPassword = await bcrypt.compare(currentPassword, user.senha);
        if (!validPassword) {
            return res.status(401).json({ message: 'Senha atual incorreta!' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({
            senha: hashedPassword,
            data_alteracao: new Date()
        });

        res.json({ message: 'Senha alterada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao alterar senha!' });
    }
};
