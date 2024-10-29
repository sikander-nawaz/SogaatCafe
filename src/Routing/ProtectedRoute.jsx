import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../Config/Firebase';

const ProtectedRoute = ({ children }) => {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    const userPassword = localStorage.getItem('userPassword');
    const location = useLocation();

    useEffect(() => {
        const fetchAdminData = async () => {
            const adminCollection = collection(db, 'Admin');
            const q = query(adminCollection, where('email', '==', userEmail));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const adminDoc = querySnapshot.docs[0];
                setAdminData({ ...adminDoc.data(), id: adminDoc.id });
            }
            setLoading(false);
        };

        if (location.pathname === '/dashboard' || location.pathname === '/home') {
            fetchAdminData();
        } else {
            setLoading(false);
        }
    }, [userEmail, location.pathname]);

    if (loading) return <div>Loading...</div>;

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    // Redirect admin trying to access /home to /dashboard
    if (location.pathname === '/home' && adminData) {
        return <Navigate to="/dashboard" />;
    }

    // For accessing the dashboard, validate admin credentials passwords
    if (location.pathname === '/dashboard' && (!adminData || userPassword !== adminData.password)) {
        return <Navigate to="/home" />;
    }

    return children;
};

export default ProtectedRoute;
