/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import api from "../../api/axios";

// bikin context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = belum login

  // cek apakah ada session (misalnya backend ada endpoint /me)
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("authentications/me", { withCredentials: true });
        setUser(res.data); // { id, fullname, role }
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await api.delete("/authentications", { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook
export function useAuth() {
  return useContext(AuthContext);
}
