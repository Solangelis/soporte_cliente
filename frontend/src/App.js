import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ChamadoForm from './pages/ChamadoForm/ChamadoForm';
import ChamadoDetail from './pages/ChamadoDetail/ChamadoDetail';
import RegisterCliente from './pages/RegisterCliente/RegisterCliente';
import LoginCliente from './pages/LoginCliente/LoginCliente'
import DashboardCliente from './pages/DashboarCliente/DashboarCliente';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AuthProvider} from "./context/AuthContext";
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const App = () => {
    return (
        <AuthProvider>
        <Router>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* RUTA ADMINISTRATIVA - Solo admin y support */}
                <Route path="/dashboard" element={
                    <ProtectedRoute allowedRoles={['admin', 'support']}>
                        <Dashboard />
                    </ProtectedRoute>
                } />
         
                {/* Rutas de Cliente */}
                <Route path="/cliente/register" element={<RegisterCliente />} />
                <Route path="/cliente/login" element={<LoginCliente />} />
                <Route path="/cliente/dashboard" element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                        <DashboardCliente />
                    </ProtectedRoute>
                } />
                
                {/* Rutas de Chamados para Cliente - Solo clientes */}
                <Route path="/cliente/chamados/novo" element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                        <ChamadoForm />
                    </ProtectedRoute>
                } />
                <Route path="/cliente/chamados/:id" element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                        <ChamadoDetail />
                    </ProtectedRoute>
                } />
                <Route path="/cliente/chamados/:id/editar" element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                        <ChamadoForm />
                    </ProtectedRoute>
                } />
                
                {/* Rutas de Chamados para Admin - Solo admin y support */}
                <Route path="/chamados/novo" element={
                    <ProtectedRoute allowedRoles={['admin', 'support']}>
                        <ChamadoForm />
                    </ProtectedRoute>
                } />
                <Route path="/chamados/:id/editar" element={
                    <ProtectedRoute allowedRoles={['admin', 'support']}>
                        <ChamadoForm />
                    </ProtectedRoute>
                } />
                <Route path="/chamados/:id" element={
                    <ProtectedRoute allowedRoles={['admin', 'support']}>
                        <ChamadoDetail />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
        </AuthProvider>
    );
};

export default App;
