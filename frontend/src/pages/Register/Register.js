import React, { useState } from 'react';
import api from '../../services/api';
import './Register.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faLock } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'O nome é obrigatório.';
    if (!formData.email) {
      newErrors.email = 'O e-mail é obrigatório.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Formato de e-mail inválido.';
      }
    }
    if (!formData.phone) {
      newErrors.phone = 'O telefone é obrigatório.';
    } else {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'O telefone deve conter 10 dígitos.';
      }
    }
    if (!formData.password) {
      newErrors.password = 'A senha é obrigatória.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    try {
      const response = await api.post('/auth/register', formData);
      alert(response.data.message);
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro durante o registro:', error.response?.data || error.message);
      alert(error.response?.data.message || 'Erro durante o registro.');
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <h1>Registrar</h1>
        <form onSubmit={(e) => e.preventDefault()} className="register-form">
          <div className="input-group">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Nome"
              value={formData.name}
              onChange={handleChange}
              required
              className={`register-input ${errors.name ? 'input-error' : ''}`}
            />
          </div>
          {errors.name && <span className="error-message">{errors.name}</span>}

          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
              className={`register-input ${errors.email ? 'input-error' : ''}`}
            />
          </div>
          {errors.email && <span className="error-message">{errors.email}</span>}

          <div className="input-group">
            <FontAwesomeIcon icon={faPhone} className="input-icon" />
            <input
              type="text"
              name="phone"
              placeholder="Telefone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={`register-input ${errors.phone ? 'input-error' : ''}`}
            />
          </div>
          {errors.phone && <span className="error-message">{errors.phone}</span>}

          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
              className={`register-input ${errors.password ? 'input-error' : ''}`}
            />
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}

          <button onClick={handleSubmit} className="register-button">Registrar</button>
        </form>
        <p className="redirect-login">
          Já tem uma conta? <a href="/login">Entrar</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
