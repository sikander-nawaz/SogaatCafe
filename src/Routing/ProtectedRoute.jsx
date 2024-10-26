import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredEmail, requiredPassword }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    const userPassword = localStorage.getItem('userPassword');
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    // Restrict access to the dashboard for non-specified users
    if (location.pathname === '/dashboard' && (userEmail !== requiredEmail || userPassword !== requiredPassword)) {
        return <Navigate to="/home" />;
    }

    return children;
};

export default ProtectedRoute;
