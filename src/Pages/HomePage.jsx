    import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import Navbar from "../Components/Navbar";

    const HomePage = () => {
        const navigate = useNavigate();

        const handleLogout = () => {
            localStorage.removeItem('isAuthenticated');
            navigate('/');
        };

        return (
            <>
                <Navbar />
                <div>
                    Home
                    <button onClick={handleLogout} className="btn btn-secondary mt-3">Logout</button>
                </div>
            </>
        );
    };

    export default HomePage;
