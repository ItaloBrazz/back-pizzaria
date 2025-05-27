const { Pizza } = require('../models/index');

const criarPizza = async (req, res) => {
  try {
    const { nome, ingredientes, preco, tamanho, imagem } = req.body;
    console.log(nome, ingredientes, preco, tamanho, imagem)
    const pizza = await Pizza.create({
      nome, ingredientes, preco, tamanho, imagem
    });
    res.status(201).json(pizza);
  } catch (error) {
    res.status(400).json({ error: 'Falha ao criar pizza' });
  }
};

const listarPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.findAll();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao buscar pizzas' });
  }
};

const obterPizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByPk(req.params.id);
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza não encontrada' });
    }
    res.json(pizza);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao buscar pizza' });
  }
};

const atualizarPizza = async (req, res) => {
  try {
    const [updated] = await Pizza.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedPizza = await Pizza.findByPk(req.params.id);
      return res.json(updatedPizza);
    }
    throw new Error('Pizza não encontrada');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletarPizza = async (req, res) => {
  try {
    const deleted = await Pizza.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.json({ message: 'Pizza deletada com sucesso' });
    }
    throw new Error('Pizza não encontrada');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  criarPizza,
  listarPizzas,
  obterPizza,
  atualizarPizza,
  deletarPizza
};