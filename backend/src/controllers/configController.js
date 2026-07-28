const Config = require('../models/Config');

exports.getLogo = async (req, res) => {
    try {
        const config = await Config.findOne({ where: { chave: 'logo' } });
        res.json({ logo: config?.valor || '' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar logo!' });
    }
};

exports.updateLogo = async (req, res) => {
    try {
        const { logo } = req.body;
        const config = await Config.findOne({ where: { chave: 'logo' } });
        
        if (config) {
            await config.update({ valor: logo });
        } else {
            await Config.create({ chave: 'logo', valor: logo });
        }
        
        res.json({ message: 'Logo atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar logo:', error);
        res.status(500).json({ message: 'Erro ao atualizar logo!' });
    }
};
