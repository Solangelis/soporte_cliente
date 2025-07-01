const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const clienteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/.+@.+\..+/, 'Por favor, insira um endereço de e-mail válido.'] 
  },
  phone: { 
    type: String, 
    required: true, 
    match: [/^\d{10,15}$/, 'Por favor, insira um número de telefone válido.'] 
  },
  password: { type: String, required: true },
  role: { type: String, default: 'cliente' }, // Definiendo el rol como 'cliente'
}, { 
  timestamps: true,
  collection: 'Cliente' 
});


clienteSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});


clienteSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Cliente', clienteSchema);