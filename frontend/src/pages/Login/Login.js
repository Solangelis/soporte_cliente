import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [selectedRole, setSelectedRole] = useState('cliente');
    const [localLoading, setLocalLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'O e-mail é obrigatório.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = 'Formato de e-mail inválido.';

        if (!formData.password) newErrors.password = 'A senha é obrigatória.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLocalLoading(true);
        try {
            const { role } = await login(formData.email, formData.password, selectedRole);

            if (role === 'cliente') {
                navigate('/cliente/dashboard');
            } else if (role === 'admin' || role === 'support') {
                navigate('/dashboard');
            } else {
                logout();
                setErrors({ general: 'Rol de usuario no válido.' });
            }
        } catch (err) {
            console.error(err);
            setErrors({ general: 'Credenciales inválidas o acceso denegado.' });
        } finally {
            setLocalLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="auth-container">
            <div className="form-container">
                <div className="login-header">
                    <div className="logo">
                        <div className="logo-icon">🎧</div>
                        <h1>Sistema de Suporte</h1>
                    </div>
                    <p className="login-subtitle">Acesse sua conta para gerenciar chamados</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                  
                    <div className="input-group">
                        <div className="input-wrapper select-wrapper">
                            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="login-input role-select"
                            >
                                <option value="cliente">Sou Cliente</option>
                                <option value="user">Sou Admin/Staff</option>
                            </select>
                        </div>
                    </div>

                    
                    <div className="input-group">
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Seu e-mail"
                                value={formData.email}
                                onChange={handleChange}
                                className={`login-input ${errors.email ? 'input-error' : ''}`}
                                autoComplete="username"
                            />
                        </div>
                        {errors.email && <span className="error-message">{errors.email}</span>}
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
                                className={`login-input ${errors.password ? 'input-error' : ''}`}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
                    
                  
                    {errors.general && (
                        <div className="error-general">
                            <span className="error-message">{errors.general}</span>
                        </div>
                    )}

                  
                    <button
                        type="submit"
                        className="login-button"
                        disabled={localLoading || authLoading}
                    >
                        {(localLoading || authLoading) ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin />
                                Entrando…
                            </>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p className="redirect-register">
                        Não tem uma conta? 
                        <a href="/cliente/register" className="register-link">
                            Registrar como Cliente
                        </a>
                    </p>
                    <div className="support-links">
                        <a href="/" className="home-link">← Voltar ao início</a>
                        <a href="/suporte" className="support-link">Precisa de ajuda?</a>
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

export default Login;
