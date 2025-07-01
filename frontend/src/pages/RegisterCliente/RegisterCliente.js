import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './RegisterCliente.css';

const RegisterCliente = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/clientes/register', formData);
      toast.success(response.data.message);
      window.location.href = '/cliente/login';
    } catch (error) {
      toast.error(error.response?.data.message || 'Erro ao registrar cliente.');
    }
  };

  return (
    <div className="register-cliente-container">
      <div className="register-cliente-form-container">
        <h1>Registrar Cliente</h1>
        <form className="register-cliente-form" onSubmit={handleRegister}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Nome completo"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          <div className="input-group">
            <input
              type="tel"
              name="phone"
              placeholder="Telefone (opcional)"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="register-button">
            Registrar
          </button>
        </form>
        <div className="login-link">
          Já tem uma conta? <a href="/cliente/login">Faça login</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterCliente;
