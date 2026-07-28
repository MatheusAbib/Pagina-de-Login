const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('cliente', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    genero: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    data_nascimento: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    telefone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    foto: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    data_cadastro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    data_alteracao: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'cliente',
    timestamps: false
});

module.exports = User;
