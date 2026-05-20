import React, { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa"; // install react-icons

const Login = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* Dark mode toggle OUTSIDE the box */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        

          {/* Title */}
          <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Sign in to your account
          </h2>

          {/* Form */}
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
  type="email"
  autoComplete="off"
  className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
  placeholder="Enter your email"
/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
            <input
  type="password"
  autoComplete="new-password"
  className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
  placeholder="Enter your password"
/>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Sign in
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
            <span className="mx-2 text-gray-500 dark:text-gray-400 text-sm">
              Or continue with
            </span>
            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          </div>

          {/* Social Button (Google only) */}
          <div className="flex space-x-3">
            <button className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md py-2 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Google
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Not a member?{" "}
            <a href="/register" className="text-indigo-600 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
