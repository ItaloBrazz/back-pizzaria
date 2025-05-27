const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db');
const {Usuario,Pizza,Pedido} = require("./models/index");
const dotenv = require("dotenv");

dotenv.config();

// Importe as rotas corretamente
const authRoutes = require('./routes/authRoutes');
const pizzaRoutes = require('./routes/pizzaRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());



// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/pedidos', pedidoRoutes);

module.exports = app;