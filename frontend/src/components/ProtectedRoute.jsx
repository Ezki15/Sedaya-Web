import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../hooks/contexts/AuthContexts";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isLogin, user } = useContext(AuthContext);

  if (!isLogin) {
    // belum login → redirect ke login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // role tidak cocok → redirect ke home
    return <Navigate to="/" replace />;
  }

  return children;
}

