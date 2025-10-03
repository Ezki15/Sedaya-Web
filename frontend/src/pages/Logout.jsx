import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Logout({ setUser, setIsLogin }) {
  const navigate = useNavigate();

  useEffect(() => {
    async function logout() {
      try {
        await api.delete("/authentications", { withCredentials: true });
        setUser({}); // reset state user di frontend
        setIsLogin(false)
        alert("Logout berhasil!");
        navigate("/");
      } catch (err) {
        alert("Logout gagal");
        console.log(err);
      }
    }
    logout();
  }, [navigate, setUser, setIsLogin]);

  return (
    <div className="flex h-screen justify-center items-center">
      <h2>Sedang logout...</h2>
    </div>
  );
}
