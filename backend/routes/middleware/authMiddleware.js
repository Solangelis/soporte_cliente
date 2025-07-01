const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Cliente = require('../../models/Cliente');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Nenhum token fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar el usuario en ambas colecciones
    let user = await User.findById(decoded.id).select('-password');
    if (!user) {
      user = await Cliente.findById(decoded.id).select('-password');
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }
    
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name
    };
    
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

// Middleware para verificar as permissões
const authorizeRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ 
      message: 'Acesso negado. Permissões insuficientes.',
      requiredRoles: roles,
      userRole: req.user?.role
    });
  }
  next();
};

// Middleware específico para administradores
const requireAdmin = (req, res, next) => {
  if (!req.user || !['admin', 'support'].includes(req.user.role)) {
    return res.status(403).json({ 
      message: 'Acesso negado. Apenas administradores podem acessar este recurso.' 
    });
  }
  next();
};

// Middleware específico para clientes
const requireClient = (req, res, next) => {
  if (!req.user || req.user.role !== 'cliente') {
    return res.status(403).json({ 
      message: 'Acesso negado. Apenas clientes podem acessar este recurso.' 
    });
  }
  next();
};

module.exports = { 
  verifyToken, 
  authorizeRole, 
  requireAdmin, 
  requireClient 
};
