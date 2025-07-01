const express = require('express');
const mongoose = require('mongoose');
const Chamado = require('../models/Chamado');
const User = require('../models/User'); 
const Cliente = require('../models/Cliente');
const { verifyToken, authorizeRole, requireAdmin } = require('./middleware/authMiddleware');

const router = express.Router();

// Crear chamado - Solo clientes pueden crear
router.post('/', verifyToken, authorizeRole('cliente'), async (req, res) => {
  const { subject, description } = req.body;
  const userId = req.user.id; 

  if (!subject || !description) {
    return res.status(400).json({ message: 'Assunto e descrição são obrigatórios.' });
  }

  try {
    const newChamado = new Chamado({
      client: userId, 
      subject,
      description,
      status: 'Aberto',
    });

    await newChamado.save();
    await newChamado.populate('client', 'name email');
    
    res.status(201).json({ 
      message: 'Chamado criado com sucesso.', 
      chamado: newChamado 
    });
  } catch (error) {
    console.error('Erro ao criar o chamado:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Listar chamados - Clientes ven solo los suyos, admins ven todos
router.get('/', verifyToken, async (req, res) => {
  try {
    let query = {};
    
    // Filtrar por rol
    if (req.user.role === 'cliente') {
      query = { client: req.user.id };
    }
    // Admin y support ven todos los chamados
    
    const chamados = await Chamado.find(query)
      .populate('client', 'name email client_id')
      .sort({ createdAt: -1 });
      
    res.json(chamados);
  } catch (error) {
    console.error('Erro ao obter os chamados:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Obtener chamado específico por ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Formato de ID de chamado inválido.' });
    }

    let filter = { _id: id };
    
    // Si es cliente, solo puede ver sus propios chamados
    if (req.user.role === 'cliente') {
      filter.client = req.user.id;
    }

    const chamado = await Chamado.findOne(filter)
      .populate('client', 'name email client_id');
    
    if (!chamado) {
      return res.status(404).json({ 
        message: 'Chamado não encontrado ou você não tem permissão para visualizá-lo.' 
      });
    }

    res.json(chamado);
  } catch (error) {
    console.error('Erro ao buscar chamado:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Actualizar chamado
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Formato de ID inválido.' });
    }

    // Verificar que el chamado existe
    const existingChamado = await Chamado.findById(id);
    if (!existingChamado) {
      return res.status(404).json({ message: 'Chamado não encontrado.' });
    }

    let update = {};
    let filter = { _id: id };

    if (req.user.role === 'cliente') {
      // Clientes solo pueden editar sus propios chamados y campos limitados
      filter.client = req.user.id;
      
      // Verificar que es el dueño del chamado
      if (existingChamado.client.toString() !== req.user.id) {
        return res.status(403).json({ 
          message: 'Você não tem permissão para editar este chamado.' 
        });
      }
      
      // Clientes no pueden editar chamados cerrados
      if (existingChamado.status === 'Fechado') {
        return res.status(403).json({ 
          message: 'Não é possível editar chamados fechados.' 
        });
      }
      
      // Campos permitidos para clientes
      const allowedFields = ['subject', 'description'];
      update = Object.fromEntries(
        Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
      );
    } else if (['admin', 'support'].includes(req.user.role)) {
      // Admins pueden editar cualquier campo de cualquier chamado
      const allowedFields = ['subject', 'description', 'status', 'response'];
      update = Object.fromEntries(
        Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
      );
    } else {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'Nenhum campo válido para atualizar.' });
    }

    const chamado = await Chamado.findOneAndUpdate(filter, update, { new: true })
      .populate('client', 'name email client_id');
      
    if (!chamado) {
      return res.status(404).json({ 
        message: 'Chamado não encontrado ou você não tem permissão para editá-lo.' 
      });
    }
    
    res.json({
      message: 'Chamado atualizado com sucesso.',
      chamado
    });
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Deletar chamado - Solo administradores
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Formato de ID de chamado inválido.' });
    }

    const deletedChamado = await Chamado.findByIdAndDelete(id);
    if (!deletedChamado) {
      return res.status(404).json({ message: 'Chamado não encontrado.' });
    }

    res.json({ 
      message: 'Chamado excluído com sucesso.',
      deletedChamado: {
        id: deletedChamado._id,
        subject: deletedChamado.subject
      }
    });
  } catch (error) {
    console.error('Erro ao excluir o chamado:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

module.exports = router;