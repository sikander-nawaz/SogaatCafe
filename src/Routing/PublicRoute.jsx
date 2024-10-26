import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    // If the user is authenticated, redirect them to the home page
    return isAuthenticated ? <Navigate to="/home" /> : children;
};

export default PublicRoute;
