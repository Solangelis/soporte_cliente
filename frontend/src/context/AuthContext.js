import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user,  setUser]  = useState(null);
    const [role,  setRole]  = useState(null);
    const [loading, setLoading] = useState(true);   // carga inicial (checar token)


    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        
        if (!token) { 
            setLoading(false); 
            return; 
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
       
        const endpoint = storedRole === 'cliente' ? '/clientes/me' : '/auth/me';
        
        api.get(endpoint)
            .then(res => {
                setUser(res.data);
                setRole(res.data.role);
            })
            .catch(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                toast.error('Sessão expirada. Faça login novamente.');
            })
            .finally(() => setLoading(false));
    }, []);

   
    const login = async (email, password, userType = 'cliente') => {
        try {
            let res;
            if (userType === 'cliente') {
                res = await api.post('/clientes/login', { email, password });
            } else {
                res = await api.post('/auth/login', { email, password });
            }
            
            const { token } = res.data;
            const payload = res.data.user || res.data.cliente;
            const currentRole = payload.role;

            // guarda estado e token
            setUser(payload);
            setRole(currentRole);
            localStorage.setItem('token', token);
            localStorage.setItem('role', currentRole);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            toast.success('Login realizado com sucesso.');
            return { role: currentRole };
        } catch (err) {
            toast.error(err.response?.data.message || 'Erro ao fazer login.');
            throw err;
        }
    };

    /* ---------- Função logout ---------- */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
        setRole(null);
        api.defaults.headers.common['Authorization'] = '';
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
