import { Navigate } from "react-router-dom";

export default function GuestRoute({ user, children }) {
  if (user) {
    // ❌ kalau sudah login → langsung lempar ke home
    return <Navigate to="/" replace />;
  }
  return children;
}
