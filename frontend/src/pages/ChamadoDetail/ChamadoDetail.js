import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './ChamadoDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const ChamadoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [chamado, setChamado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    useEffect(() => {
        fetchChamado();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Tem certeza de que deseja remover este chamado?')) {
            return;
        }

        try {
            await api.delete(`/chamados/${id}`);
            toast.success('Chamado removido com sucesso.');
            navigate('/dashboard');
        } catch (err) {
            console.error('Erro ao remover chamado:', err.response?.data || err.message);
            toast.error(err.response?.data.message || 'Erro ao remover chamado.');
        }
    };

    if (loading) {
        return (
            <div className="chamado-detail-container">
                <div className="loading">
                    <FontAwesomeIcon icon="spinner" spin />
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
                </div>
            </div>
        );
    }

    return (
        <div className="chamado-detail-container">
            <header className="chamado-detail-header">
                <Link to="/dashboard" className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> Voltar
                </Link>
                <div className="chamado-actions">
                    <Link to={`/chamados/${id}/editar`} className="action-button edit">
                        <FontAwesomeIcon icon={faEdit} /> Editar
                    </Link>
                    <button onClick={handleDelete} className="action-button delete">
                        <FontAwesomeIcon icon={faTrash} /> Remover
                    </button>
                </div>
            </header>

            <main className="chamado-detail-main">
                <h2>{chamado.subject}</h2>
                <p><strong>Status:</strong> {chamado.status}</p>
                <p><strong>Descrição:</strong></p>
                <p>{chamado.description}</p>
                <p><strong>Data de Criação:</strong> {new Date(chamado.createdAt).toLocaleDateString('pt-BR')}</p>
                <p><strong>Última Atualização:</strong> {new Date(chamado.updatedAt).toLocaleDateString('pt-BR')}</p>
                <p><strong>Cliente:</strong> {chamado.client.name} (ID: {chamado.client.client_id})</p>
            </main>
        </div>
    );
};

export default ChamadoDetail;
