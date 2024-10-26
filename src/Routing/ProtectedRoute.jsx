import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredEmail }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    const userPassword = localStorage.getItem('userPassword');
    const storedAdminPassword = localStorage.getItem('adminPassword');
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (location.pathname === '/dashboard' && (userEmail !== requiredEmail || userPassword !== storedAdminPassword)) {
        return <Navigate to="/home" />;
    }

    return children;
};

export default ProtectedRoute;
