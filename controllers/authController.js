// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Usuario } = require("../models/index");

module.exports = {
  register: async (req, res) => {
    try {
      const { nome, email, senha } = req.body;

      console.log(nome, email, senha);

      if (!nome || !email || !senha) {
        return res
          .status(400)
          .json({ error: "Todos os campos são obrigatórios" });
      }

      const usuarioExistente = await Usuario.findOne({ where: { email } });

      if (usuarioExistente) {
        return res.status(400).json({ error: "Email já cadastrado" });
      }

      const usuario = await Usuario.create({
        nome,
        email,
        senha: await bcrypt.hash(senha, 10),
        role: email.endsWith("@pizzaria.com") ? "admin" : "user",
      });

      const token = jwt.sign(
        { id: usuario.id, role: usuario.role },
        "e2c8620c1e1216a49527788d35df251c",
        { expiresIn: "1h" }
      );

      const usuarioSemSenha = usuario.toJSON();
      delete usuarioSemSenha.senha;

      res.status(201).json({ usuario: usuarioSemSenha, token });
    } catch (error) {
      console.error("Erro no registro:", error);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      console.log(email, senha);

      if (!email || !senha) {
        return res
          .status(400)
          .json({ error: "Email e senha são obrigatórios" });
      }

      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
        return res.status(401).json({ error: "E-mail e senha incorretos!" });
      }

      const passwordMatch = await bcrypt.compare(senha, usuario.senha);

      if (!passwordMatch) {
        return res.status(401).json({ error: "E-mail e senha incorretos!" });
      }

      const token = jwt.sign(
        { id: usuario.id, role: usuario.role },
        "e2c8620c1e1216a49527788d35df251c",
        { expiresIn: "1h" }
      );

      const usuarioSemSenha = usuario.toJSON();
      delete usuarioSemSenha.senha;

      res.json({ usuario: usuarioSemSenha, token });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  },

  atualizarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, email, senha } = req.body;

      // Verifica se o usuário logado é o mesmo que está sendo atualizado
      if (req.usuario.id !== parseInt(id) && req.usuario.role !== "admin") {
        return res.status(403).json({ error: "Acesso não autorizado" });
      }

      const dadosAtualizacao = { nome, email };

      if (req.usuario.role !== "admin" && email.endsWith("@pizzaria.com")) {
        return res
          .status(403)
          .json({
            error: "Emails @pizzaria.com são exclusivos para administradores",
          });
      }

      // Atualiza a senha apenas se for fornecida
      if (senha) {
        dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
      }

      const [atualizado] = await Usuario.update(dadosAtualizacao, {
        where: { id },
        returning: true, // Retorna o registro atualizado
        plain: true,
      });

      if (!atualizado) {
        return res.status(404).json({ error: "Atualizado com sucesso" });
      }

      // Busca o usuário atualizado sem a senha
      const usuarioAtualizado = await Usuario.findByPk(id, {
        attributes: { exclude: ["senha"] },
      });

      res.json(usuarioAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  },
};
