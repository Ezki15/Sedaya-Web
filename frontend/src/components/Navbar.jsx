import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="ml-auto border-b-2 p-6">    
        <ul className="flex w-[90%] m-auto justify-between items-center text-black font-semibold">
            <li>Logo</li>
            <div className="flex space-x-6">
            <li><Link to="/register" className="hover:underline">Register</Link></li>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
            <li><Link to="/admin" className="hover:underline">Admin Panel</Link></li>
            </div>
        </ul>
    </nav>
  );
}
