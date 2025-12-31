import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  // Këtu mund të bësh edhe kontrollin e skadimit të tokenit nëse dëshiron

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
