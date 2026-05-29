import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaMoon, FaSun, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  HiOutlineMail,
  HiOutlineKey,
  HiOutlineUser,
  HiOutlinePhone,
  HiUserAdd,
} from "react-icons/hi";
import { useAuth } from "../../context/authContex";
import { register } from "../../services/api";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase and a number.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
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
      const res = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 opacity-80" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 opacity-80" />

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

      <div className="relative w-full max-w-5xl flex items-center justify-center z-10">
        {/* Left: Welcome panel (swapped sides for visual variation) */}
        <div className="hidden md:flex relative w-[45%] h-[600px] rounded-xl shadow-2xl overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 items-center justify-center -mr-10">
          <div className="absolute top-10 -left-10 w-60 h-60 rounded-full bg-blue-400 opacity-30 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-blue-300 opacity-20 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-blue-500 opacity-30 blur-2xl" />

          <div className="relative z-10 text-center text-white px-8">
            <h2 className="text-4xl font-extrabold tracking-wide mb-4">
              HELLO!
            </h2>
            <p className="text-sm mb-8 opacity-90">
              Already have an account? Sign in to continue
            </p>
            <Link
              to="/login"
              className="inline-block px-12 py-3 rounded-md bg-blue-700/60 hover:bg-blue-700 border border-blue-300/40 text-white font-bold tracking-wider shadow-lg transition"
            >
              LOGIN
            </Link>
          </div>
        </div>

        {/* Right: Register card */}
        <form
          onSubmit={handleSubmit}
          className="relative z-20 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-10 md:p-12 w-full md:w-[60%]"
        >
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-8 inline-block border-b-2 border-gray-800 dark:border-white pb-1">
            Create account
          </h2>

          <div className="space-y-4">
            <div className="flex space-x-3">
              <div className="flex items-center bg-white dark:bg-gray-700 border-l-4 border-blue-600 rounded-md shadow px-4 py-3">
                <HiOutlineUser className="text-gray-400 text-xl mr-3" />
                <span className="text-gray-300 mr-3">|</span>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="flex-1 bg-transparent outline-none text-gray-700 dark:text-white placeholder-gray-400"
                />
              </div>

              <div className="flex items-center bg-white dark:bg-gray-700 border-l-4 border-blue-600 rounded-md shadow px-4 py-3">
                <HiOutlineUser className="text-gray-400 text-xl mr-3" />
                <span className="text-gray-300 mr-3">|</span>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="flex-1 bg-transparent outline-none text-gray-700 dark:text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center bg-white dark:bg-gray-700 border-l-4 border-blue-600 rounded-md shadow px-4 py-3">
              <HiOutlineUser className="text-gray-400 text-xl mr-3" />
              <span className="text-gray-300 mr-3">|</span>
              <input
                type="text"
                name="email"
                placeholder="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="flex-1 bg-transparent outline-none text-gray-700 dark:text-white placeholder-gray-400"
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}

            {/* Password */}
            <div className="flex items-center bg-white dark:bg-gray-700 border-l-4 border-blue-600 rounded-md shadow px-4 py-3">
              <HiOutlineKey className="text-gray-400 text-xl mr-3" />
              <span className="text-gray-300 mr-3">|</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="flex-1 bg-transparent outline-none text-gray-700 dark:text-white placeholder-gray-400"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}

            {/* Confirm Password */}
            <div className="flex items-center bg-white dark:bg-gray-700 border-l-4 border-blue-600 rounded-md shadow px-4 py-3">
              <HiOutlineKey className="text-gray-400 text-xl mr-3" />
              <span className="text-gray-300 mr-3">|</span>
              <input
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="flex-1 bg-transparent outline-none text-gray-700 dark:text-white placeholder-gray-400"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-md shadow-lg transition disabled:opacity-60"
          >
            <HiUserAdd className="text-xl" />
            {loading ? "Creating..." : "SIGN UP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
