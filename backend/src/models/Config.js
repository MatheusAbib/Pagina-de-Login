const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Config = sequelize.define('config', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    chave: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    valor: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    descricao: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'config',
    timestamps: false
});

module.exports = Config;
