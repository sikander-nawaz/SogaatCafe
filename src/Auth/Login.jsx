import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from "../Assets/Images/Sogaat_Photo-removebg-preview.png";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const email_pass = [
        ["arham@gmail.com", "123456"],
        ["ansari@gmail.com", "1234567"]
    ];

    const handleLogin = (e) => {
        e.preventDefault();
        
        const isValid = email_pass.some(([validEmail, validPassword]) =>
            email === validEmail && password === validPassword
        );

        if (isValid) {
            localStorage.setItem('isAuthenticated', 'true'); 
            navigate('/home');
        } else {
            alert("Invalid email or password. Please try again.");
        }
        setEmail("")
        setPassword("")
    };

    return (
        <div className='bg-dark'>
            <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-4 col-md-6 col-sm-8" style={{ backgroundColor: "#F8F9FA", padding: "25px", borderRadius: "20px" }}>
                    <img
                        src={Image}
                        alt=""
                        width={170}
                        height={180}
                        className="d-block mx-auto mb-4"
                        style={{ objectFit: "cover", borderRadius: "10px" }}
                    />
                    <div className="mb-4 text-center">
                        <h4 style={{ fontWeight: "bold" }}>Login to your Account</h4>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-1 d-flex justify-content-between">
                            <label className="form-label">Password</label>
                            <label className="form-label">
                                <span
                                    style={{
                                        textDecoration: "none",
                                        color: "#6366F1",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                    }}
                                >
                                    Forgot Password?
                                </span>
                            </label>
                        </div>
                        <input
                            type="password"
                            className="form-control mb-3"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="btn btn-primary mb-3 mx-auto d-block"
                            role="button"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
