const Config = require('../models/Config');

exports.getFavicon = async (req, res) => {
    try {
        const config = await Config.findOne({ where: { chave: 'logo' } });
        const logo = config?.valor || '';
        
        if (logo) {
            res.set('Content-Type', 'image/png');
            const base64Data = logo.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            res.send(buffer);
        } else {
            res.status(404).send('Favicon not found');
        }
    } catch (error) {
        res.status(500).send('Error');
    }
};
