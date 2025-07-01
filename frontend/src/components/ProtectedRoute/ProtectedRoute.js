import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, role, loading } = useAuth();
    const token = localStorage.getItem('token');

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!token || !user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return <Navigate to={role === 'cliente' ? '/cliente/dashboard' : '/dashboard'} />;
    }

    return children;
};

export default ProtectedRoute;
