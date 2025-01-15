import React, { useEffect, useState } from 'react'; 
import api from '../../services/api';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify'; 

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/auth/me');
                setUser(response.data);
            } catch (error) {
                console.error('Erro ao obter informações do usuário:', error.response?.data || error.message);
                toast.error(error.response?.data.message || 'Erro ao obter informações do usuário.');
                window.location.href = '/login';
            }
        };

        const fetchChamados = async () => {
            try {
                const response = await api.get('/chamados');
                setChamados(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao obter chamados:', error.response?.data || error.message);
                setError(error.response?.data.message || 'Erro ao obter chamados.');
                setLoading(false);
                toast.error(error.response?.data.message || 'Erro ao obter chamados.');
            }
        };

        fetchUser();
        fetchChamados();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza de que deseja remover este chamado?')) {
            return;
        }

        try {
            await api.delete(`/chamados/${id}`);
            setChamados(chamados.filter(chamado => chamado._id !== id));
            toast.success('Chamado removido com sucesso.');
        } catch (error) {
            console.error('Erro ao remover chamado:', error.response?.data || error.message);
            toast.error(error.response?.data.message || 'Erro ao remover chamado.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>Carregando chamados...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="error">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Bem-vindo, {user.name}!</h1>
                <button onClick={handleLogout} className="logout-button">Sair</button>
            </header>

            <main className="dashboard-main">
                <div className="dashboard-actions">
                    <Link to="/chamados/novo" className="add-button">
                        <FontAwesomeIcon icon={faPlus} /> Novo Chamado
                    </Link>
                </div>

                <h2>Seus Chamados</h2>
                {chamados.length === 0 ? (
                    <p>Você não tem chamados.</p>
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
                            {chamados.map((chamado) => (
                                <tr key={chamado._id}>
                                    <td>{chamado.subject}</td>
                                    <td>{chamado.status}</td>
                                    <td>{new Date(chamado.createdAt).toLocaleDateString('pt-BR')}</td>
                                    <td>
                                        <Link to={`/chamados/${chamado._id}/editar`} className="action-button edit">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Link>
                                        <button onClick={() => handleDelete(chamado._id)} className="action-button delete">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
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

export default Dashboard;
