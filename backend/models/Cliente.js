const mongoose = require('mongoose');

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
        match: [/^\d{10}$/, 'Por favor, insira um número de telefone válido com 10 dígitos.'] 
    },
}, { 
    timestamps: true,
    collection: 'Cliente' 
});

module.exports = mongoose.model('Cliente', clienteSchema);
