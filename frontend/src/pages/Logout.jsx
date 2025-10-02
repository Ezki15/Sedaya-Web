import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Logout({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    async function logout() {
      try {
        await api.delete("/authentications", { withCredentials: true });
        setUser(null); // reset state user di frontend
        alert("Logout berhasil!");
        navigate("/");
      } catch (err) {
        alert("Logout gagal");
        console.log(err);
      }
    }
    logout();
  }, [navigate, setUser]);

  return (
    <div class  Name="flex h-screen justify-center items-center">
      <h2>Sedang logout...</h2>
    </div>
  );
}
