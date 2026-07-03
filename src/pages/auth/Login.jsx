import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaMoon, FaSun, FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineMail, HiOutlineKey, HiLogin } from "react-icons/hi";
import { useAuth } from "../../context/authContex";
import { login, getMyApplication } from "../../services/api";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, user } = useAuth();

 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(true);

const { darkMode, toggleDarkMode } = useAuth();
const BG_IMAGE =
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80";

useEffect(() => {
  document.documentElement.classList.toggle('dark', darkMode);
  localStorage.setItem('darkMode', darkMode);
}, [darkMode]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      redirectByRole(user.role);
    }
  }, [user]);

  const redirectByRole = async (role) => {
    if (role === "APPLICANT") {
      try {
        await getMyApplication();
        navigate("/my-application");
      } catch (error) {
        navigate("/apply");
      }
    } else if (role === "HR") {
      navigate("/hr/dashboard");
    } else if (role === "SUPER_ADMIN") {
      navigate("/admin/dashboard");
    }
  };

  // useEffect(() => {
  //   if (user) redirectByRole(user);
  // }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await login(formData);
      const { token, user } = res.data.data;
      loginUser(token, user, rememberMe);
      toast.success(`Welcome , ${user.firstName}!`);
      redirectByRole(user.role);
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 relative overflow-hidden">
    
    {/* Blurred background image (z-0, lowest layer) */}
    <div
      className="absolute inset-0 bg-cover bg-center scale-110 z-0"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        filter: "blur(8px) brightness(0.6)",
      }}
    />

    {/* Decorative blobs (z-10, ABOVE the background now) */}
    <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 opacity-70 z-10" />
    <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 opacity-70 z-10" />

    {/* Dark mode toggle */}
    <button
  onClick={toggleDarkMode}
  className="absolute top-5 right-5 p-3 rounded-full bg-white dark:bg-gray-800 shadow z-20"
>
  {darkMode ? (
    <FaSun className="text-yellow-400" />
  ) : (
    <FaMoon className="text-gray-700" />
  )}
</button>

    {/* Wrapper with offset cards */}
    <div className="relative w-full max-w-5xl flex items-center justify-center z-20">
      
      {/* Left: Login card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-20 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-10 md:p-12 w-full md:w-[55%] md:-mr-10 md:mt-0 -mt-6"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-8 inline-block border-b-2 border-gray-800 dark:border-white pb-1">
          Login please
        </h2>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            className={`mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 ${
              errors.email
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className={`mt-1 w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter your password"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
  type="checkbox"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
/>
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-md shadow-lg transition disabled:opacity-60"
        >
          <HiLogin className="text-xl" />
          {loading ? "Signing in..." : "LOG IN"}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Not a member?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </form>

      {/* Right: Welcome panel */}
      <div className="hidden md:flex relative w-[45%] h-[520px] rounded-xl shadow-2xl overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 items-center justify-center">
        <div className="absolute top-10 -left-10 w-60 h-60 rounded-full bg-blue-400 opacity-30 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-blue-300 opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-blue-500 opacity-30 blur-2xl" />

        <div className="relative z-10 text-center text-white px-8">
          <h2 className="text-4xl font-extrabold tracking-wide mb-4">
            WELCOME!
          </h2>
          <p className="text-sm mb-8 opacity-90">
            Enter your details and Send your application
          </p>
          <Link
            to="/register"
            className="inline-block px-12 py-3 rounded-md bg-blue-700/60 hover:bg-blue-700 border border-blue-300/40 text-white font-bold tracking-wider shadow-lg transition"
          >
            SIGNUP
          </Link>
        </div>
      </div>
    </div>
  </div>
);
};

export default Login;