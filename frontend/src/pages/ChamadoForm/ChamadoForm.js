import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import './ChamadoForm.css';
import { toast } from 'react-toastify';

const ChamadoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        status: 'Aberto',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            const fetchChamado = async () => {
                setLoading(true);
                try {
                    const response = await api.get(`/chamados/${id}`);
                    setFormData({
                        subject: response.data.subject,
                        description: response.data.description,
                        status: response.data.status,
                    });
                    setLoading(false);
                } catch (err) {
                    console.error('Erro ao buscar chamado:', err.response?.data || err.message);
                    setError(err.response?.data.message || 'Erro ao buscar chamado.');
                    setLoading(false);
                    toast.error(err.response?.data.message || 'Erro ao buscar chamado.');
                }
            };

            fetchChamado();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

    
        if (!formData.subject || !formData.description) {
            setError('Assunto e descrição são obrigatórios.');
            toast.error('Assunto e descrição são obrigatórios.');
            return;
        }

        setLoading(true);

        try {
            if (id) {
           
                await api.put(`/chamados/${id}`, formData);
                toast.success('Chamado atualizado com sucesso.');
            } else {
          
                await api.post('/chamados', formData);
                toast.success('Chamado criado com sucesso.');
            }
            navigate('/dashboard');
        } catch (err) {
            console.error('Erro ao salvar chamado:', err.response?.data || err.message);
            setError(err.response?.data.message || 'Erro ao salvar chamado.');
            toast.error(err.response?.data.message || 'Erro ao salvar chamado.');
            setLoading(false);
        }
    };

    return (
        <div className="chamado-form-container">
            <h2>{id ? 'Editar Chamado' : 'Novo Chamado'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="chamado-form">
                <div className="form-group">
                    <label htmlFor="subject">Assunto</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="Assunto do chamado"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Descrição</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Descrição detalhada do chamado"
                    ></textarea>
                </div>
                {id && (
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Aberto">Aberto</option>
                            <option value="Em Progresso">Em Progresso</option>
                            <option value="Resolvido">Resolvido</option>
                            <option value="Fechado">Fechado</option>
                        </select>
                    </div>
                )}
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
            </form>
        </div>
    );
};

export default ChamadoForm;
