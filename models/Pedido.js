const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const Pedido = sequelize.define('Pedido', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  pizzaId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  quantidade: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  enderecoEntrega: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: true
  },
  total: {
    type: Sequelize.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'pedidos', // Explicitly set table name
  timestamps: false
});

module.exports = Pedido;