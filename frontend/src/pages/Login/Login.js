import React, { useState } from 'react';
import api from '../../services/api';
import './Login.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'O e-mail é obrigatório.';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Formato de e-mail inválido.';
            }
        }

        if (!formData.password) {
            newErrors.password = 'A senha é obrigatória.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/login', formData);
            console.log('Resposta do backend:', response.data);

            alert(response.data.message);
            localStorage.setItem('token', response.data.token);
            window.location.href = '/dashboard'; 
        } catch (error) {
            console.error('Erro ao realizar login:', error.response?.data || error.message);
            alert(error.response?.data.message || 'Erro ao realizar o login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="form-container">
                <h1>Entrar</h1>
                <form onSubmit={(e) => e.preventDefault()} className="login-form">
                    <div className="input-group">
                        <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={`login-input ${errors.email ? 'input-error' : ''}`}
                        />
                    </div>
                    {errors.email && <span className="error-message">{errors.email}</span>}

                    <div className="input-group">
                        <FontAwesomeIcon icon={faLock} className="input-icon" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Senha"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={`login-input ${errors.password ? 'input-error' : ''}`}
                        />
                    </div>
                    {errors.password && <span className="error-message">{errors.password}</span>}

                    <button onClick={handleSubmit} className="login-button" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <p className="redirect-register">
                    Não tem uma conta? <a href="/register">Registrar</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
