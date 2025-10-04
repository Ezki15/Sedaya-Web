import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  

  async function handleLogin(e) {
    e.preventDefault();
    try {
      // 1. Login → cookie token otomatis tersimpan
      await api.post(
        "/authentications",
        { email, password },
        { withCredentials: true }
      );

      // 2. Update state global → biar App.jsx nanti otomatis fetch /me
      setIsLogin(true);

      // 3. Redirect sementara (App.jsx akan override sesuai role)
      navigate("/");

      alert("Login berhasil!");
    } catch (err) {
      alert("Login gagal");
      console.error(err);
    }
  }


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
