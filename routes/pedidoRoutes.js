const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const {
  criarPedido,
  listarPedidos,
  obterPedido,
  atualizarPedido,
  deletarPedido,
  listarPedidosUsuario
} = require('../controllers/pedidoController');


// Todas as rotas requerem autenticação
router.use(auth);


// Rotas para usuários comuns
router.post('/', criarPedido);
router.get('/meus-pedidos', listarPedidosUsuario);
router.get('/:id', obterPedido);

// Rotas para admin (podem ver todos os pedidos)
router.get('/', listarPedidos); // Apenas admin
router.put('/:id', atualizarPedido); // Admin pode atualizar status
router.delete('/:id', deletarPedido); // Admin pode deletar

module.exports = router;