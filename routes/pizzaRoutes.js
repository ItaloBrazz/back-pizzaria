const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middlewares/auth');
const { 
  criarPizza,
  listarPizzas,
  obterPizza,
  atualizarPizza,
  deletarPizza
} = require('../controllers/pizzaController');

// Rotas públicas
router.get('/', listarPizzas);
router.get('/:id', obterPizza);

// Rotas protegidas (apenas admin)
router.post('/', auth, admin, criarPizza);
router.put('/:id', auth, admin, atualizarPizza);
router.delete('/:id', auth, admin, deletarPizza);

module.exports = router;