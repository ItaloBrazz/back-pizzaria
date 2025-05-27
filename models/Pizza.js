const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const Pizza = sequelize.define('Pizza', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ingredientes: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  preco: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  tamanho: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imagem: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'pizzas', // Explicitly set table name to 'pizzas'
  timestamps: false // Disable timestamps if not needed
});

module.exports = Pizza;