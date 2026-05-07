// import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.user);
  
  if (token) {
    return <Outlet />;        // 👈 Agar token hai to page show karo
  }
  
  return <Navigate to="/login" replace />; // 👈 Token nahi to login par bhejo
};

export default ProtectedRoute;