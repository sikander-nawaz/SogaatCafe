import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../Config/Firebase";
import Image from "../Assets/Images/Sogaat_Photo-removebg-preview.png";
import { Modal, Input } from 'antd';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [adminId, setAdminId] = useState('');
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    const pass = "admin1235"
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (email === "arham@gmail.com" && password === pass) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userPassword', password);
            navigate('/dashboard');
        } else {
            const usersRef = collection(db, 'Users');
            const q = query(usersRef, where('email', '==', email), where('password', '==', password));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userPassword', password);
                navigate('/home');
            } else {
                alert("Invalid email or password. Please try again.");
            }
        }
        setLoading(false);
        setEmail("");
        setPassword("");
    };

    const handleForgotPassword = () => {
        const adminIdToCheck = "admin123"; // Define your admin ID here
        if (adminId === adminIdToCheck) {
            if (newPassword) {
                // Save the new password locally, or handle it as required
                localStorage.setItem('adminPassword', newPassword); // Store it as an example
                alert("Password updated successfully!");
            } else {
                alert("Please enter a new password.");
            }
            setIsModalVisible(false);
        } else {
            alert("Incorrect Admin ID");
        }
        setAdminId("")
        setNewPassword("")
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
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control mb-3"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="mb-1 d-flex justify-content-end">
                            <label className="form-label">
                                <span
                                    onClick={() => setIsModalVisible(true)}
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
                        <button
                            type="submit"
                            className="btn btn-primary mb-3 mx-auto d-block"
                            disabled={loading} 
                        >
                            {loading ? (
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>
                </div>
            </div>
            <Modal
                title="Reset Admin Password"
                visible={isModalVisible}
                onOk={handleForgotPassword}
                onCancel={() => setIsModalVisible(false)}
            >
                <Input
                    placeholder="Admin ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                />
                <Input.Password
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ marginTop: '10px' }}
                />
            </Modal>
        </div>
    );
};

export default Login;
