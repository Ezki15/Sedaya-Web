import { useState } from "react";
import api from "../../api/axios";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useImmer({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((draf) => {
      draf.push({ [name]: value });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/users/register", formData);
      setMessage(`✅ User created with ID: ${response.data.id}`);
      if (response.status === 201) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setMessage("❌ Failed to register user");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-[url('/images/bg-pattern.jpg')] bg-cover bg-center">
  <form
    onSubmit={handleSubmit}
    className="relative flex flex-col bg-white/30 backdrop-blur-md shadow-lg border border-white/40 w-96 rounded-2xl my-6"
  >
    {/* Header */}
    <div className="relative m-2.5 flex justify-center items-center text-white h-24 rounded-lg bg-slate-800/90 shadow-md">
      <h3 className="text-2xl font-semibold tracking-wide">Register User</h3>
    </div>

    {/* Form Fields */}
    <div className="flex flex-col gap-4 p-6">
      {/* Full Name */}
      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-700 font-medium">
          Full Name
        </label>
        <input
          type="text"
          name="fullname"
          placeholder="Your Full Name"
          value={formData.fullname}
          onChange={handleChange}
          className="w-full bg-white/60 placeholder:text-slate-400 text-slate-800 text-sm border border-slate-300 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
          required
        />
      </div>

      {/* Username */}
      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-700 font-medium">
          Username
        </label>
        <input
          type="text"
          name="username"
          placeholder="Choose a Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full bg-white/60 placeholder:text-slate-400 text-slate-800 text-sm border border-slate-300 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
          required
        />
      </div>

      {/* Email */}
      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-700 font-medium">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-white/60 placeholder:text-slate-400 text-slate-800 text-sm border border-slate-300 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
          required
        />
      </div>

      {/* Password */}
      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-700 font-medium">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full bg-white/60 placeholder:text-slate-400 text-slate-800 text-sm border border-slate-300 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
          required
        />
      </div>
    </div>

    {/* Submit Button */}
    <div className="p-6 pt-0">
      <button
        type="submit"
        className="w-full rounded-md bg-slate-800/90 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 active:bg-slate-700"
      >
        Register
      </button>

      {/* Message */}
      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* Link to Login */}
      <p className="flex justify-center mt-6 text-sm text-slate-700">
        Already have an account?
        <a
          href="#login"
          className="ml-1 text-sm font-semibold text-slate-800 underline"
        >
          Login
        </a>
      </p>
    </div>
  </form>
</div>

  );
}

export default Register;
