import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './ChamadoDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const ChamadoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [chamado, setChamado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchChamado = async () => {
            try {
                const response = await api.get(`/chamados/${id}`);
                setChamado(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Erro ao buscar chamado:', err.response?.data || err.message);
                setError(err.response?.data.message || 'Erro ao buscar chamado.');
                setLoading(false);
                toast.error(err.response?.data.message || 'Erro ao buscar chamado.');
            }
        };
    
        fetchChamado();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Tem certeza de que deseja remover este chamado?')) {
            return;
        }

        try {
            await api.delete(`/chamados/${id}`);
            toast.success('Chamado removido com sucesso.');
            
            if (user?.role === 'cliente') {
                navigate('/cliente/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Erro ao remover chamado:', err.response?.data || err.message);
            toast.error(err.response?.data.message || 'Erro ao remover chamado.');
        }
    };

    if (loading) {
        return (
            <div className="chamado-detail-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <span>Carregando chamado...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chamado-detail-container">
                <div className="error">
                    <p>{error}</p>
                    <Link 
                        to={user?.role === 'cliente' ? '/cliente/dashboard' : '/dashboard'} 
                        className="back-button"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} /> Voltar ao Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Determinar las rutas correctas según el rol
    const dashboardRoute = user?.role === 'cliente' ? '/cliente/dashboard' : '/dashboard';
    const editRoute = user?.role === 'cliente' ? `/cliente/chamados/${id}/editar` : `/chamados/${id}/editar`;

    return (
        <div className="chamado-detail-container">
            <header className="chamado-detail-header">
                <Link to={dashboardRoute} className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> Voltar
                </Link>
                <div className="chamado-actions">
                    {chamado.status !== 'fechado' && (
                        <Link to={editRoute} className="action-button edit">
                            <FontAwesomeIcon icon={faEdit} /> Editar
                        </Link>
                    )}
                    {user?.role !== 'cliente' && (
                        <button onClick={handleDelete} className="action-button delete">
                            <FontAwesomeIcon icon={faTrash} /> Remover
                        </button>
                    )}
                </div>
            </header>

            <main className="chamado-detail-main">
                <div className="chamado-info">
                    <h1>{chamado.subject}</h1>
                    <div className="chamado-meta">
                        <span className={`status-badge status-${chamado.status.toLowerCase().replace(' ', '-')}`}>
                            {chamado.status}
                        </span>
                        <span className="chamado-date">
                            Criado em {new Date(chamado.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                    </div>
                </div>
                
                <div className="chamado-content">
                    <h3>Descrição</h3>
                    <div className="description-box">
                        {chamado.description}
                    </div>
                    
                    <div className="chamado-details">
                        <div className="detail-item">
                            <strong>Última Atualização:</strong> 
                            {new Date(chamado.updatedAt).toLocaleDateString('pt-BR')}
                        </div>
                        {user?.role !== 'cliente' && (
                            <div className="detail-item">
                                <strong>Cliente:</strong> 
                                {chamado.client.name} (ID: {chamado.client.client_id})
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChamadoDetail;
