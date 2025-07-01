import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './LoginCliente.css';

const LoginCliente = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/clientes/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', 'cliente');
      toast.success('Login realizado com sucesso!');
      window.location.href = '/cliente/dashboard';
    } catch (error) {
      if (error.response) {
        const message = error.response.data.message || 'Credenciais inválidas';
        toast.error(message);
        setErrors({ general: message });
      } else if (error.request) {
        toast.error('Nenhuma resposta do servidor. Tente novamente mais tarde.');
        setErrors({ general: 'Erro de conexão' });
      } else {
        toast.error('Erro ao fazer login.');
        setErrors({ general: 'Erro inesperado' });
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-cliente-container">
      <div className="login-cliente-form-container">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">🎧</div>
            <h1>Portal do Cliente</h1>
          </div>
          <p className="login-subtitle">Acesse sua conta para gerenciar seus chamados</p>
        </div>

        <form className="login-cliente-form" onSubmit={handleLogin}>
          {errors.general && (
            <div className="error-message">
              <FontAwesomeIcon icon="exclamation-triangle" />
              {errors.general}
            </div>
          )}

          <div className="input-group">
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Seu e-mail"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                required
              />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Lembrar de mim
            </label>
            <Link to="/cliente/recuperar-senha" className="forgot-password">
              Esqueceu a senha?
            </Link>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Não tem uma conta? 
            <Link to="/cliente/register" className="register-link">
              Registre-se aqui
            </Link>
          </p>
          <div className="support-links">
            <Link to="/" className="home-link">← Voltar ao início</Link>
            <Link to="/suporte" className="support-link">Precisa de ajuda?</Link>
          </div>
        </div>
      </div>

      <div className="login-background">
        <div className="background-shape shape-1"></div>
        <div className="background-shape shape-2"></div>
        <div className="background-shape shape-3"></div>
      </div>
    </div>
  );
};

export default LoginCliente;
