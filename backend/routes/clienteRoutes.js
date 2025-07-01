const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Cliente = require('../models/Cliente');
const { verifyToken, requireAdmin, authorizeRole } = require('./middleware/authMiddleware');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// Registro de cliente - Público
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body; 
  
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Formato de e-mail inválido.' });
  }
  
  try {
    const existingCliente = await Cliente.findOne({ email });
    if (existingCliente) {
      return res.status(400).json({ message: 'E-mail já está em uso.' });
    }

    const newCliente = new Cliente({ 
      name, 
      email, 
      password, 
      phone, 
      role: 'cliente' 
    });
    
    await newCliente.save();
    
    res.status(201).json({ 
      message: 'Cliente registrado com sucesso.',
      cliente: {
        id: newCliente._id,
        name: newCliente.name,
        email: newCliente.email,
        client_id: newCliente.client_id
      }
    });
  } catch (error) {
    console.error('Erro ao registrar cliente:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Login de cliente - Público
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const cliente = await Cliente.findOne({ email });
    if (!cliente) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    const isPasswordValid = await cliente.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: cliente._id, role: cliente.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'Login realizado com sucesso.',
      token, 
      user: { 
        id: cliente._id, 
        name: cliente.name, 
        email: cliente.email, 
        role: cliente.role,
        client_id: cliente.client_id
      } 
    });
  } catch (error) {
    console.error('Erro ao autenticar cliente:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Obtener información del cliente autenticado
router.get('/me', verifyToken, authorizeRole('cliente'), async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.user.id).select('-password');
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    res.json(cliente);
  } catch (error) {
    console.error('Erro ao obter informações do cliente:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Listar todos los clientes - Solo administradores
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const clientes = await Cliente.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    const total = await Cliente.countDocuments(query);
    
    res.json({
      clientes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Obtener cliente específico - Solo administradores
router.get('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id).select('-password');
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    res.json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

module.exports = router;
