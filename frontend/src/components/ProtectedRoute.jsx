import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, role, children }) {
  if (!user) {
    // ❌ kalau belum login → lempar ke /login
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // ❌ kalau role tidak sesuai → lempar ke home
    return <Navigate to="/" replace />;
  }

  // ✅ kalau lolos validasi → render child route
  return children;
}
