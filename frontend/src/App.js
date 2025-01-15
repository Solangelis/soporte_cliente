import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ChamadoForm from './pages/ChamadoForm/ChamadoForm';
import ChamadoDetail from './pages/ChamadoDetail/ChamadoDetail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <Router>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/chamados/novo" element={
                    <ProtectedRoute>
                        <ChamadoForm />
                    </ProtectedRoute>
                } />
                <Route path="/chamados/:id/editar" element={
                    <ProtectedRoute>
                        <ChamadoForm />
                    </ProtectedRoute>
                } />
                <Route path="/chamados/:id" element={
                    <ProtectedRoute>
                        <ChamadoDetail />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
};

export default App;
