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

  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // Apply dark mode to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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
      loginUser(token, user);
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
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 opacity-80" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 opacity-80" />

      {/* Dark mode toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-5 right-5 p-3 rounded-full bg-white dark:bg-gray-800 shadow z-20"
      >
        {darkMode ? (
          <FaSun className="text-yellow-400" />
        ) : (
          <FaMoon className="text-gray-700" />
        )}
      </button>

      {/* Wrapper with offset cards */}
      <div className="relative w-full max-w-5xl flex items-center justify-center z-10">
        {/* Left: Login card */}
        <form
          onSubmit={handleSubmit}
          className="relative z-20 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-10 md:p-12 w-full md:w-[55%] md:-mr-10 md:mt-0 -mt-6"
        >
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-10 inline-block border-b-2 border-gray-800 dark:border-white pb-1">
            Login please
          </h2>

          {/* Email */}
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
          <div>
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

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mb-8">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm cursor-pointer"></label>
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors underline underline-offset-2"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-md shadow-lg transition disabled:opacity-60"
          >
            <HiLogin className="text-xl" />
            {loading ? "Signing in..." : "LOG IN"}
          </button>
        </form>

        {/* Right: Welcome panel */}
        <div className="hidden md:flex relative w-[45%] h-[520px] rounded-xl shadow-2xl overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 items-center justify-center">
          {/* Blob shapes */}
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
