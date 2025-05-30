const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const userController = require('../controllers/authController');

router.put('/:id', auth, userController.atualizarUsuario);

module.exports = router;

