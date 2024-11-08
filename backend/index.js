const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

app.get('/', (req, res) => {
    res.send('Servidor backend funcionando!');
});

app.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`);
});
