import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { db } from "../Config/Firebase";
import Image from "../Assets/Images/logo.png";
import { Modal, Input, message } from "antd";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [adminId, setAdminId] = useState(""); // New state for adminId
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const usersRef = collection(db, "Users");
    const qUser = query(
      usersRef,
      where("email", "==", email),
      where("password", "==", password)
    );
    const userSnapshot = await getDocs(qUser);

    const adminRef = collection(db, "Admin");
    const qAdmin = query(
      adminRef,
      where("email", "==", email),
      where("password", "==", password)
    );
    const adminSnapshot = await getDocs(qAdmin);

    if (!userSnapshot.empty) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);
      navigate("/home");
    } else if (!adminSnapshot.empty) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);
      navigate("/dashboard");
    } else {
      // alert("Invalid email or password. Please try again.");
      message.error("Invalid email or password. Please try again.");
    }

    setLoading(false);
    setEmail("");
    setPassword("");
  };

  const handleForgotPassword = async () => {
    if (adminId && newPassword) {
      // Check if the entered adminId matches the logged-in userId (email in this)
      if (adminId === "97k3Us1Su0Kg93g4Vm79") {
        const adminDocRef = doc(db, "Admin", "97k3Us1Su0Kg93g4Vm79"); // Change this if you have a dynamic way of getting the admin ID
        try {
          await updateDoc(adminDocRef, { password: newPassword });
          message.success("Password updated successfully!");
          setIsModalVisible(false);
        } catch (error) {
          console.error("Error updating password:", error);
          message.error("Failed to update password. Please try again.");
        }
      } else {
        message.error("Admin ID does not match the logged-in user's ID.");
      }
    } else {
      alert("Please enter a new password and admin ID.");
    }
    setNewPassword("");
    setAdminId(""); // Clear adminId after processing
  };

  return (
    <div className="bg-dark">
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
        <div
          className="col-lg-4 col-md-6 col-sm-8"
          style={{
            backgroundColor: "#F8F9FA",
            padding: "25px",
            borderRadius: "20px",
          }}
        >
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
            <div className="input-group mb-3">
              <input
                type={passwordVisible ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="input-group-text"
                onClick={() => setPasswordVisible(!passwordVisible)}
                style={{ cursor: "pointer" }}
              >
                {passwordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>
            <div className="mb-1 d-flex justify-content-end">
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
          style={{ marginTop: "10px" }}
        />
        <Input.Password
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ marginTop: "10px" }}
        />
      </Modal>
    </div>
  );
};

export default Login;
