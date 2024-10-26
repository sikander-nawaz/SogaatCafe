import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  // If the user is authenticated, redirect to dashboard or home page
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;
