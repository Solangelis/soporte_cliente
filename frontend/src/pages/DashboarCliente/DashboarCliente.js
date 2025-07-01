import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';
import './DashboarCliente.css';

const DashboardCliente = () => {
    const [user, setUser] = useState(null);
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('todos'); 

    
    useEffect(() => {
        const fetchUser = () =>
            api.get('/clientes/me')
                .then(r => setUser(r.data));

        const fetchChamados = () =>
            api.get('/chamados')
                .then(r => setChamados(r.data));

        Promise.all([fetchUser(), fetchChamados()])
            .catch(err => {
                console.error(err);
                toast.error('Erro ao carregar dados.');
                setError('Erro ao carregar dados.');
                if (err.response?.status === 401) window.location.href = '/cliente/login';
            })
            .finally(() => setLoading(false));
    }, []);

    /* ---------- FILTRAR CHAMADOS ---------- */
    const filteredChamados = chamados.filter(chamado => {
        if (filter === 'todos') return true;
        return chamado.status.toLowerCase() === filter;
    });

    
    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logout realizado com sucesso!');
        window.location.href = '/cliente/login';
    };

    
    if (loading) {
        return (
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <Skeleton height={32} width={220} style={{marginBottom: 16}}/>
                </header>
                <main className="dashboard-main">
                    <Skeleton count={5} height={20}/>
                </main>
            </div>
        );
    }

    if (error) return <p>{error}</p>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Bem-vindo, {user?.name}!</h1>
                <button onClick={handleLogout} className="logout-button">
                    Sair
                </button>
            </header>

            <main className="dashboard-main">
                <div className="dashboard-actions">
                    <h2>Meus Chamados</h2>
                    <div className="action-buttons">
                        <Link to="/cliente/chamados/novo" className="btn-primary">
                            ➕ Novo Chamado
                        </Link>
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            className="btn-primary"
                            style={{background: 'white', color: '#2196F3', border: '2px solid #2196F3'}}
                        >
                            <option value="todos">Todos os Status</option>
                            <option value="aberto">Aberto</option>
                            <option value="em-andamento">Em Andamento</option>
                            <option value="fechado">Fechado</option>
                        </select>
                    </div>
                </div>

                {filteredChamados.length === 0 ? (
                    <div className="empty-state">
                        <h3>📋 Nenhum chamado encontrado</h3>
                        <p>
                            {filter === 'todos' 
                                ? 'Você ainda não tem chamados. Crie seu primeiro chamado!' 
                                : `Você não tem chamados com status "${filter}".`
                            }
                        </p>
                        <Link to="/cliente/chamados/novo" className="btn-success">
                            ➕ Criar Primeiro Chamado
                        </Link>
                    </div>
                ) : (
                    <table className="chamados-table">
                        <thead>
                            <tr>
                                <th>Assunto</th>
                                <th>Status</th>
                                <th>Data de Criação</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredChamados.map((chamado) => (
                                <tr key={chamado._id}>
                                    <td>{chamado.subject}</td>
                                    <td>
                                        <span className={`status-badge status-${chamado.status.toLowerCase().replace(' ', '-')}`}>
                                            {chamado.status}
                                        </span>
                                    </td>
                                    <td>{new Date(chamado.createdAt).toLocaleDateString('pt-BR')}</td>
                                    <td>
                                        <div className="table-actions">
                                            <Link 
                                                to={`/cliente/chamados/${chamado._id}`} 
                                                className="btn-view"
                                            >
                                                👁️ Ver
                                            </Link>
                                            {chamado.status !== 'fechado' && (
                                                <Link 
                                                    to={`/cliente/chamados/${chamado._id}/editar`} 
                                                    className="btn-edit"
                                                >
                                                    ✏️ Editar
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};

export default DashboardCliente;
