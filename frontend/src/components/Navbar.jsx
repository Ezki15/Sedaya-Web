import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../hooks/contexts/AuthContexts";

export default function Navbar() {
  const { isLogin } = useContext(AuthContext);

  return (
    <nav className="ml-auto border-b-2 p-6">
      <ul className="flex w-[90%] m-auto justify-between items-center text-black font-semibold">
        <li>
          <Link to="/">Logo</Link>
        </li>
        <div className="flex space-x-6">
          {isLogin ? (
            // Render when logged in
            <>
              <li>
                <Link to="/logout" className="hover:underline">
                  Logout
                </Link>
              </li>
            </>
          ) : (
            // Render when not logged in
            <>
              <li>
                <Link to="/register" className="hover:underline">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
}
