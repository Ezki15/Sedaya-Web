import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";
import Logout from "./pages/Logout";
import { AuthContext } from "./hooks/contexts/AuthContexts";
import api from "./api/axios";

function App() {
  const [user, setUser] = useState(null); // null = belum diketahui
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true); // untuk cegah flicker

  // Hydrate user saat app pertama kali load / login berubah
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.get("/authentications/me", {
          withCredentials: true,
        });
        setUser(res.data.data); // { id, name, role }
        setIsLogin(true);
      } catch (err) {
        if (err.response?.status === 401) {
          console.log("Belum login, user anonymous");
        } else {
          console.error(err);
        }
        setUser(null);
        setIsLogin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [isLogin]);

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <AuthContext.Provider value={{ user, isLogin, setUser, setIsLogin }}>
        {!(isLogin && user?.role === "admin") && <Navbar />}
        <Routes>
          {/* Route publik */}
          <Route
            path="/register"
            element={!isLogin ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={
              !isLogin ? <Login setIsLogin={setIsLogin} /> : <Navigate to="/" />
            }
          />

          {/* Route private (user login) */}
          <Route
            path="/"
            element={
              isLogin && user?.role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Home />
              )
            }
          />

          {/* Route khusus admin */}
          <Route
            path="/admin"
            element={
              isLogin && user?.role === "admin" ? (
                <AdminPanel />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Logout */}
          <Route
            path="/logout"
            element={<Logout setUser={setUser} setIsLogin={setIsLogin} />}
          />

          {/* Catch-all redirect */}
          <Route
            path="*"
            element={
              isLogin ? (
                <Navigate to={user?.role === "admin" ? "/admin" : "/"} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
