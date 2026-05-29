import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { HiOutlineMail, HiPaperAirplane } from "react-icons/hi";
import { forgotPassword } from "../../services/api";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem('darkMode') === 'true';
});

useEffect(() => {
  document.documentElement.classList.toggle('dark', darkMode);
  localStorage.setItem('darkMode', darkMode);
}, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      await forgotPassword({ email });
      toast.success("Email verified! Redirecting...");
      setTimeout(() => navigate('/reset-password', { state: { email: email } }), 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send reset link");
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
        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="relative z-20 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-10 md:p-12 w-full md:w-[55%] md:-mr-10 md:mt-0 -mt-6"
        >
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-3 inline-block border-b-2 border-gray-800 dark:border-white pb-1">
            Forgot password?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Enter the email tied to your account.
          </p>

          <div className="flex items-center bg-white dark:bg-gray-700 border-l-4 border-blue-600 rounded-md shadow px-4 py-3 mb-6">
            <HiOutlineMail className="text-gray-400 text-xl mr-3" />
            <span className="text-gray-300 mr-3">|</span>
            <input
              type="email"
              placeholder="Input your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 dark:text-white placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading || sent}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-md shadow-lg transition disabled:opacity-60"
          >
            <HiPaperAirplane className="text-xl rotate-90" />
            {sent ? "LINK SENT" : loading ? "SENDING..." : "RESET"}
          </button>

          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            Remembered it?{" "}
            <Link to="/login" className="text-blue-600 font-semibold underline">
              Back to login
            </Link>
          </p>
        </form>

        {/* Blue side panel */}
        <div className="hidden md:flex relative w-[45%] h-[460px] rounded-xl shadow-2xl overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 items-center justify-center">
          <div className="absolute top-10 -left-10 w-60 h-60 rounded-full bg-blue-400 opacity-30 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-blue-300 opacity-20 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-blue-500 opacity-30 blur-2xl" />

          <div className="relative z-10 text-center text-white px-8">
            <h2 className="text-4xl font-extrabold tracking-wide mb-4">
              NO WORRIES!
            </h2>
            <p className="text-sm mb-8 opacity-90">
              We'll help you get back into your account safely.
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

export default ForgotPassword;
