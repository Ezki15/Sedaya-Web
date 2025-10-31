import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../hooks/contexts/AuthContexts";
import { Menu, X } from "lucide-react"; // ikon dari lucide-react

export default function Navbar() {
  const { isLogin } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200">
      <div className="w-[80%] mx-auto flex justify-between items-center py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 tracking-tight hover:text-blue-700 transition-colors"
        >
          🛒 MyShop
        </Link>

        {/* Tombol hamburger (mobile) */}
        <button
          className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Menu desktop */}
        <ul className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
          {isLogin ? (
            <>
              <li>
                <Link
                  to="/orders"
                  className="hover:text-blue-600 transition-colors"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/logout"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/register"
                  className="hover:text-blue-600 transition-colors"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Menu mobile dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
          <ul className="w-[90%] flex flex-col items-end py-4 space-y-3 text-gray-700 font-medium">
            {isLogin ? (
              <>
                <li>
                  <Link
                    to="/orders"
                    onClick={() => setIsOpen(false)}
                    className="hover:text-blue-600 transition-colors"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/logout"
                    onClick={() => setIsOpen(false)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="hover:text-blue-600 transition-colors"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
