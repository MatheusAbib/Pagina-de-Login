const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes');
const cardRoutes = require('./routes/cardRoutes');
const configRoutes = require('./routes/configRoutes');
const faviconRoutes = require('./routes/faviconRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/config', configRoutes);
app.use('/api/favicon', faviconRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor rodando!' });
});

sequelize.authenticate()
    .then(() => {
        console.log('✅ Conectado ao banco de dados MySQL!');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Erro ao conectar ao banco:', err);
    });
