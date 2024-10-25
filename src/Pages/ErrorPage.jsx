import React from 'react';
import Navbar from '../Components/Navbar';


const ErrorPage = () => {
    return (
        <>
            <Navbar/>
            <div style={styles.container}>
                <h1 style={styles.errorCode}>404</h1>
                <h2 style={styles.title}>Oops! Page Not Found</h2>
                <p style={styles.message}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <button style={styles.button} onClick={() => window.location.href = '/'}>
                    Go Back Home
                </button>
            </div>
        </>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8f8f8',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '0 20px'
    },
    errorCode: {
        fontSize: '8rem',
        fontWeight: 'bold',
        color: '#ff6b6b',
        marginBottom: '20px'
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '500',
        marginBottom: '20px'
    },
    message: {
        fontSize: '1.2rem',
        lineHeight: '1.5',
        marginBottom: '30px',
        maxWidth: '600px'
    },
    button: {
        padding: '10px 20px',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#ff6b6b',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease'
    }
};

export default ErrorPage;
