const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Address = sequelize.define('endereco', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    tipo_residencia: DataTypes.STRING,
    numero: DataTypes.STRING,
    bairro: DataTypes.STRING,
    cep: DataTypes.STRING,
    cidade: DataTypes.STRING,
    estado: DataTypes.STRING,
    pais: DataTypes.STRING,
    endereco_entrega: DataTypes.STRING,
    descricao_endereco: DataTypes.STRING,
    cliente_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: 'endereco',
    timestamps: false
});

Address.belongsTo(User, { foreignKey: 'cliente_id' });
User.hasMany(Address, { foreignKey: 'cliente_id' });

module.exports = Address;
