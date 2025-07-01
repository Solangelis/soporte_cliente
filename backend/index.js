const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); 
const clienteRoutes = require('./routes/clienteRoutes'); 
const userRoutes = require('./routes/userRoutes');
const chamadoRoutes = require('./routes/chamadoRoutes'); 
const cors = require('cors'); 

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
}



app.use(express.json());



app.use(cors({
  origin: ['http://localhost:3000'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use((req, res, next) => {
  console.log(`Requisição recebida: ${req.method} ${req.url}`);
  next();
});


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));


app.use('/api/auth', authRoutes); 
app.use('/api/clientes', clienteRoutes); 
app.use('/api/chamados', chamadoRoutes); 
app.use('/api/usuarios', userRoutes); 
 


app.get('/', (req, res) => {
  res.send('Backend em execução!');
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


