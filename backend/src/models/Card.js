const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Card = sequelize.define('cartao', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    numero_cartao: DataTypes.STRING,
    bandeira: DataTypes.STRING,
    codigo_seguranca: DataTypes.STRING,
    nome_cartao: DataTypes.STRING,
    validade: DataTypes.STRING,
    cliente_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: 'cartao',
    timestamps: false
});

Card.belongsTo(User, { foreignKey: 'cliente_id' });
User.hasMany(Card, { foreignKey: 'cliente_id' });

module.exports = Card;
