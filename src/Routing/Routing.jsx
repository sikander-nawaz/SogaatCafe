import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../Auth/Login";
import HomePage from "../Pages/HomePage";
import Dashboard from "../Pages/DashBoard";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Error from "../Pages/ErrorPage";
import Users from "../SubPages/Users";

const Routing = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredEmail="arham@gmail.com">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Error />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
};

export default Routing;
