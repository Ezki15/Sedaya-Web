import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar"; // pastikan folder components ada
import Logout from "./pages/Logout";
import { AuthContext } from "./hooks/contexts/AuthContexts";


function App() {
  const [user, setUser] = useState({}); // belum login
  const [isLogin, setIsLogin] = useState(false);


  return (
    <Router>
      <AuthContext.Provider value={{ user, isLogin }}>
        <Navbar /> {/* Navbar akan selalu tampil di atas */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} setIsLogin={setIsLogin}/>} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/logout" element={<Logout setUser={setUser} setIsLogin={setIsLogin}/>} />
        </Routes>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
