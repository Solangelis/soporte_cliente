const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { verifyToken } = require('./middleware/authMiddleware');

const router = express.Router();


router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password)
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });

  if (password.length < 6)
    return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ message: 'Formato de e-mail inválido.' });

  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'O e-mail já existe.' });

    const newUser = new User({ name, email, phone, password, role: 'support' }); // role opcional
    await newUser.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  } catch (err) {
    console.error('Erro durante o registro:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'E-mail ou senha inválidos.' });

    const ok = await user.comparePassword(password);
    if (!ok)  return res.status(401).json({ message: 'E-mail ou senha inválidos.' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login realizado com sucesso.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Erro durante o login:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});


router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
    res.json(user);
  } catch (err) {
    console.error('Erro ao obter informações do usuário:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

module.exports = router;
