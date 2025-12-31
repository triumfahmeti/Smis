// Components/Login/RoleRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user")); 
  const role = user?.role;   // p.sh. "Admin", "SuperAdmin", "Student"

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
