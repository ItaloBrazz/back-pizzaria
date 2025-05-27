const { Pedido, Pizza, Usuario } = require('../models/index');

const criarPedido = async (req, res) => {
  try {
    const { pizzaId, quantidade, enderecoEntrega } = req.body;
    
    const pizza = await Pizza.findByPk(pizzaId);
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza não encontrada' });
    }

    const pedido = await Pedido.create({
      usuarioId: req.userid,
      pizzaId,
      quantidade,
      enderecoEntrega,
      total: pizza.preco * quantidade,
      status: 'pendente'
    });

    res.status(201).json(pedido);
  } catch (error) {
    res.status(400).json({ error: 'Falha ao criar pedido' });
  }
};

const listarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        { model: Pizza, attributes: ['nome', 'preco'] },
        { model: Usuario, attributes: ['nome', 'email'] }
      ]
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao buscar pedidos' });
  }
};

const listarPedidosUsuario = async (req, res) => {
  try {
    if (req.usuario.role === 'admin') {
      const pedidos = await Pedido.findAll({
        include: [
          { model: Pizza, attributes: ['nome', 'preco', 'imagem'] },
          { model: Usuario, attributes: ['nome', 'email'] }
        ]
      });
      return res.json(pedidos);
    }

    if (req.usuario.role === 'user') {
      const pedidos = await Pedido.findAll({
        where: { usuarioId: req.usuario.id },
        include: [
          { model: Pizza, attributes: ['nome', 'preco', 'imagem'] }
        ]
      });
      return res.json(pedidos);
    }

    return res.status(403).json({ error: 'Acesso negado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha ao buscar pedidos' });
  }
};


const obterPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findOne({
      where: { id: req.params.id },
      include: [
        { model: Pizza, attributes: ['nome', 'preco'] },
        { model: Usuario, attributes: ['nome', 'email'] }
      ]
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Verifica se o usuário é o dono do pedido ou admin
    if (pedido.usuarioId !== req.userid && req.usuario.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao buscar pedido' });
  }
};

const atualizarPedido = async (req, res) => {
  try {
    // Apenas admin pode atualizar pedidos
    if (req.usuario.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const [updated] = await Pedido.update(req.body, {
      where: { id: req.params.id }
    });

    if (updated) {
      const updatedPedido = await Pedido.findByPk(req.params.id, {
        include: [
          { model: Pizza, attributes: ['nome', 'preco'] },
          { model: Usuario, attributes: ['nome', 'email'] }
        ]
      });
      return res.json(updatedPedido);
    }
    throw new Error('Pedido não encontrado');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletarPedido = async (req, res) => {
  try {
    // Apenas admin pode deletar pedidos
    if (req.usuario.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const deleted = await Pedido.destroy({
      where: { id: req.params.id }
    });

    if (deleted) {
      return res.json({ message: 'Pedido deletado com sucesso' });
    }
    throw new Error('Pedido não encontrado');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  criarPedido,
  listarPedidos,
  obterPedido,
  atualizarPedido,
  deletarPedido,
  listarPedidosUsuario
};