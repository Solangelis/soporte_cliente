import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faUsers, faChartLine, faBars, faUserTie, faUser, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    const { user, role, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="navbar-logo">
                    <h2>🎫 Sistema de Chamados</h2>
                </div>
                <input type="checkbox" id="navbar-toggle" className="navbar-toggle-checkbox" />
                <label htmlFor="navbar-toggle" className="navbar-toggle-label">
                    <FontAwesomeIcon icon={faBars} />
                </label>
                <ul className="navbar-menu">
                    <li><Link to="/">Início</Link></li>
                    
                    {/* Botón directo a login para usuarios no autenticados */}
                    {!user ? (
                        <li>
                            <Link 
                                to="/login"
                                className="cta-entrar"
                            >
                                <FontAwesomeIcon icon={faSignInAlt} style={{marginRight: '8px'}} />
                                Entrar
                            </Link>
                        </li>
                    ) : (
                        
                        <>
                            {role === 'admin' && (
                                <li><Link to="/dashboard">Admin</Link></li>
                            )}
                            {role === 'cliente' && (
                                <li><Link to="/cliente/dashboard">Mi Panel</Link></li>
                            )}
                            <li>
                                <button 
                                    onClick={handleLogout}
                                    className="navbar-logout-btn"
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} style={{marginRight: '5px'}} />
                                    Sair
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            <header className="home-header">
                {!user ? (
                    // Contenido para usuarios no autenticados
                    <>
                        <h1>Bem-vindo ao Sistema de Chamados</h1>
                        <p>Gerencie seus chamados de forma eficiente e organizada com nossa plataforma moderna.</p>
                        <div className="home-buttons">
                            <Link to="/login" className="home-button">
                                <FontAwesomeIcon icon={faSignInAlt} style={{marginRight: '8px'}} />
                                Entrar no Sistema
                            </Link>
                            <Link to="/cliente/register" className="home-button-secondary">
                                Criar Conta
                            </Link>
                        </div>
                    </>
                ) : (

                    <>
                        <h1>Bem-vindo de volta, {user.name}!</h1>
                        <p>
                            {role === 'admin' 
                                ? 'Acesse o painel administrativo para gerenciar todos os chamados do sistema.'
                                : 'Acesse seu painel para visualizar e gerenciar seus chamados.'
                            }
                        </p>
                        <div className="home-buttons">
                            {role === 'admin' ? (
                                <Link to="/dashboard" className="home-button">
                                    <FontAwesomeIcon icon={faUserTie} style={{marginRight: '8px'}} />
                                    Painel Administrativo
                                </Link>
                            ) : (
                                <>
                                    <Link to="/cliente/dashboard" className="home-button">
                                        <FontAwesomeIcon icon={faUser} style={{marginRight: '8px'}} />
                                        Meu Painel
                                    </Link>
                                    <Link to="/cliente/chamados/novo" className="home-button-secondary">
                                        ➕ Novo Chamado
                                    </Link>
                                </>
                            )}
                        </div>
                    </>
                )}
            </header>

            <section className="home-features">
                <h2>Por Que Escolher Nosso Sistema?</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <FontAwesomeIcon icon={faCheckCircle} className="feature-icon" />
                        <h3>Fácil de Usar</h3>
                        <p>Interface intuitiva que facilita a gestão de chamados para clientes e administradores.</p>
                    </div>
                    <div className="feature-item">
                        <FontAwesomeIcon icon={faUsers} className="feature-icon" />
                        <h3>Colaboração</h3>
                        <p>Permite que equipes colaborem de forma eficiente na resolução de problemas.</p>
                    </div>
                    <div className="feature-item">
                        <FontAwesomeIcon icon={faChartLine} className="feature-icon" />
                        <h3>Acompanhamento</h3>
                        <p>Acompanhe o status dos seus chamados em tempo real com notificações.</p>
                    </div>
                </div>
            </section>

            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()} Sistema de Chamados. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Home;
