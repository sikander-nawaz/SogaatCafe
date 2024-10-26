import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../Auth/Login';
import HomePage from '../Pages/HomePage';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import Error from '../Pages/ErrorPage';

const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="*" element={<Error />} />
        </Routes>
    );
};

export default Routing;
