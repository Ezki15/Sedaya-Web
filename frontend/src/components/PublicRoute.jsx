// import { Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../hooks/contexts/AuthContexts";

// export default function PublicRoute({ children }) {
//   const { isLogin, user } = useContext(AuthContext);

//   if (isLogin) {
//     // kalau sudah login, jangan ke login/register lagi
//     return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
//   }

//   return children;
// }
