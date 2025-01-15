import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faUsers, faChartLine, faBars } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="navbar-logo">
                    <h2>Chamados</h2>
                </div>
                <input type="checkbox" id="navbar-toggle" className="navbar-toggle-checkbox" />
                <label htmlFor="navbar-toggle" className="navbar-toggle-label">
                    <FontAwesomeIcon icon={faBars} />
                </label>
                <ul className="navbar-menu">
                    <li><Link to="/">Início</Link></li>
                    <li><Link to="/login">Entrar</Link></li>
                    <li><Link to="/register">Registrar-se</Link></li>
                </ul>
            </nav>

            <header className="home-header">
                <h1>Bem-vindo ao Nosso Sistema de Chamados</h1>
                <p>Gerencie seus chamados de forma eficiente e organizada.</p>
                <div className="home-buttons">
                    <Link to="/login" className="home-button">Entrar</Link>
                    <Link to="/register" className="home-button-secondary">Registrar-se</Link>
                </div>
            </header>

            <section className="home-features">
                <h2>Por Que Escolher Nosso Sistema?</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <FontAwesomeIcon icon={faCheckCircle} className="feature-icon" />
                        <h3>Fácil de Usar</h3>
                        <p>Interface intuitiva que facilita a gestão de chamados.</p>
                    </div>
                    <div className="feature-item">
                        <FontAwesomeIcon icon={faUsers} className="feature-icon" />
                        <h3>Colaboração</h3>
                        <p>Permite que equipes colaborem de forma eficiente.</p>
                    </div>
                    <div className="feature-item">
                        <FontAwesomeIcon icon={faChartLine} className="feature-icon" />
                        <h3>Relatórios</h3>
                        <p>Gere relatórios detalhados para análise de desempenho.</p>
                    </div>
                </div>
            </section>

            <section className="home-about">
                <h2>Sobre Nós</h2>
                <p>
                    Nosso sistema de chamados foi desenvolvido para atender às necessidades de empresas que buscam 
                    eficiência na gestão de solicitações e problemas. Com funcionalidades avançadas e uma interface amigável.
                </p>
            </section>

            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()}  Chamados. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Home;
