const Address = require('../models/Address');

exports.createAddress = async (req, res) => {
    try {
        const addressData = {
            ...req.body,
            cliente_id: req.userId
        };
        const address = await Address.create(addressData);
        res.status(201).json({ message: 'Endereço criado com sucesso!', address });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar endereço!' });
    }
};

exports.getUserAddresses = async (req, res) => {
    try {
        const addresses = await Address.findAll({
            where: { cliente_id: req.userId }
        });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar endereços!' });
    }
};

exports.getAddressById = async (req, res) => {
    try {
        const address = await Address.findOne({
            where: { id: req.params.id, cliente_id: req.userId }
        });
        if (!address) {
            return res.status(404).json({ message: 'Endereço não encontrado!' });
        }
        res.json(address);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar endereço!' });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const address = await Address.findOne({
            where: { id: req.params.id, cliente_id: req.userId }
        });
        if (!address) {
            return res.status(404).json({ message: 'Endereço não encontrado!' });
        }
        await address.update(req.body);
        res.json({ message: 'Endereço atualizado com sucesso!', address });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar endereço!' });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOne({
            where: { id: req.params.id, cliente_id: req.userId }
        });
        if (!address) {
            return res.status(404).json({ message: 'Endereço não encontrado!' });
        }
        await address.destroy();
        res.json({ message: 'Endereço deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar endereço!' });
    }
};
