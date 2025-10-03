import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser, setIsLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  

  function handleLogin (e) {
    e.preventDefault();
    setIsSubmit(true);
  };

  useEffect(() => {
    if (isSubmit) {
      const login = async () => {
        try {
          // 1. Login → simpan cookie token otomatis
          await api.post(
            "/authentications",
            { email, password },
            { withCredentials: true }
          );

          // 2. Ambil data user valid dari backend
          const res = await api.get("authentications/me", { withCredentials: true });
          const userData = res.data;
          
          // 3. Simpan user ke state global (atau context)
          setUser(userData);
          
          console.log(userData.data.role);
          // 4. Redirect sesuai role
          if (userData.data.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }

          setIsLogin(true);

          alert("Login berhasil!");
        } catch (err) {
          alert("Login gagal");
          console.error(err);
        } finally {
          setIsSubmit(false);
        }
      };
      login();
    }
  
  }, [isSubmit, email, password, navigate, setUser, setIsLogin]);

  return (
    <div className="flex h-[80vh] justify-center items-center">
      <form onSubmit={handleLogin} className="p-6 bg-white shadow rounded">
        <h1 className="font-bold mb-4">Login</h1>
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 mb-2 w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
