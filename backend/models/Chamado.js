const mongoose = require('mongoose'); 

const chamadoSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Aberto', 'Em Progresso', 'Resolvido', 'Fechado'], 
        default: 'Aberto' 
    },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { 
    timestamps: true,
    collection: 'Chamado'
});

module.exports = mongoose.model('Chamado', chamadoSchema);
