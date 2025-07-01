import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleClientLogin = () => {
        onClose();
        navigate('/login-cliente');
    };

    const handleAdminLogin = () => {
        onClose();
        navigate('/login');
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Escolha seu tipo de acesso</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    <div className="login-options">
                        <div className="login-option client-option" onClick={handleClientLogin}>
                            <div className="option-icon">
                                <i className="fas fa-user"></i>
                            </div>
                            <h3>Área do Cliente</h3>
                            <p>Acesse sua conta para acompanhar seus chamados e solicitar suporte</p>
                            <div className="option-features">
                                <span>• Visualizar chamados</span>
                                <span>• Criar novos chamados</span>
                                <span>• Acompanhar status</span>
                            </div>
                        </div>
                        
                        <div className="login-option admin-option" onClick={handleAdminLogin}>
                            <div className="option-icon">
                                <i className="fas fa-cog"></i>
                            </div>
                            <h3>Área Administrativa</h3>
                            <p>Acesso para administradores e equipe de suporte</p>
                            <div className="option-features">
                                <span>• Gerenciar chamados</span>
                                <span>• Administrar clientes</span>
                                <span>• Relatórios e estatísticas</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;