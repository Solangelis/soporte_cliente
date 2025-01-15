const express = require('express');
const mongoose = require('mongoose');
const Chamado = require('../models/Chamado');
const User = require('../models/User'); 

const router = express.Router();

const verifyToken = require('./middleware/authMiddleware');


router.post('/', verifyToken, async (req, res) => {
  const { subject, description, status } = req.body;
  const userId = req.user.id; 

  if (!subject || !description) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const newChamado = new Chamado({
      client: user._id, 
      subject,
      description,
      status,
    });

    await newChamado.save();
    res.status(201).json({ message: 'Chamado criado com sucesso.', chamado: newChamado });
  } catch (error) {
    console.error('Erro ao criar o chamado:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const chamados = await Chamado.find().populate('client', 'name email client_id');
    res.json(chamados);
  } catch (error) {
    console.error('Erro ao obter os chamados:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});


router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Formato de ID de chamado inválido.' });
    }

    const chamado = await Chamado.findById(id).populate('client', 'name email client_id');
    if (!chamado) {
      return res.status(404).json({ message: 'Chamado não encontrado.' });
    }

    res.json(chamado);
  } catch (error) {
    console.error('Erro ao obter o chamado:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { subject, description, status } = req.body;

  if (!subject || !description || !status) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios para atualizar.' });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Formato de ID de chamado inválido.' });
    }

    const updatedChamado = await Chamado.findByIdAndUpdate(
      id,
      { subject, description, status },
      { new: true, runValidators: true }
    ).populate('client', 'name email client_id');

    if (!updatedChamado) {
      return res.status(404).json({ message: 'Chamado não encontrado.' });
    }

    res.json({ message: 'Chamado atualizado com sucesso.', chamado: updatedChamado });
  } catch (error) {
    console.error('Erro ao atualizar o chamado:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});


router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Formato de ID de chamado inválido.' });
    }

    const deletedChamado = await Chamado.findByIdAndDelete(id);
    if (!deletedChamado) {
      return res.status(404).json({ message: 'Chamado não encontrado.' });
    }

    res.json({ message: 'Chamado excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir o chamado:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

module.exports = router;
