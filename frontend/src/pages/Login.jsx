import { useState } from "react";
import api from "../api/axios";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/authentications", { email, password }, { withCredentials: true });
      const decodedToken = jwtDecode(res.data.data.accessToken);
      if(decodedToken.role === "admin"){
        navigate("/admin");
      } else {
        navigate("/");
      }
      alert("Login berhasil!");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Login gagal");
    }
  };

  return (
    <>
      <div className="flex h-[80vh] justify-center items-center">
        <form onSubmit={handleLogin} className="p-6 bg-white shadow rounded">
          <h1 className="font-bold mb-4">Login</h1>
          <input
            className="border p-2 mb-2 w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <input
            type="password"
            className="border p-2 mb-2 w-full"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </button>
        </form>
      </div>
    </>
  );
}
