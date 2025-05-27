const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/index');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findOne({ where: { id: decoded.id } });
    if (!usuario) {
      throw new Error();
    }
    req.userid = usuario.id;
    req.role = usuario.role;
    req.token = token;
    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Por favor, autentique-se.' });
  }
};

const admin = (req, res, next) => {
  if (req.usuario.role !== 'admin') {
    return res.status(403).send({ error: 'Acesso negado.' });
  }
  next();
};

module.exports = { auth, admin };