const Card = require('../models/Card');

exports.createCard = async (req, res) => {
    try {
        const cardData = {
            ...req.body,
            cliente_id: req.userId
        };
        const card = await Card.create(cardData);
        res.status(201).json({ message: 'Cartão criado com sucesso!', card });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar cartão!' });
    }
};

exports.getUserCards = async (req, res) => {
    try {
        const cards = await Card.findAll({
            where: { cliente_id: req.userId }
        });
        res.json(cards);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar cartões!' });
    }
};

exports.getCardById = async (req, res) => {
    try {
        const card = await Card.findOne({
            where: { id: req.params.id, cliente_id: req.userId }
        });
        if (!card) {
            return res.status(404).json({ message: 'Cartão não encontrado!' });
        }
        res.json(card);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar cartão!' });
    }
};

exports.updateCard = async (req, res) => {
    try {
        const card = await Card.findOne({
            where: { id: req.params.id, cliente_id: req.userId }
        });
        if (!card) {
            return res.status(404).json({ message: 'Cartão não encontrado!' });
        }
        await card.update(req.body);
        res.json({ message: 'Cartão atualizado com sucesso!', card });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar cartão!' });
    }
};

exports.deleteCard = async (req, res) => {
    try {
        const card = await Card.findOne({
            where: { id: req.params.id, cliente_id: req.userId }
        });
        if (!card) {
            return res.status(404).json({ message: 'Cartão não encontrado!' });
        }
        await card.destroy();
        res.json({ message: 'Cartão deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar cartão!' });
    }
};
