import { createContext, useContext, useState, useEffect,useRef } from 'react';
import { getMe, getMyApplication } from '../services/api';

const AuthContext = createContext();
const TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const timerRef = useRef(null);

    // Apply dark class to <html> whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

 useEffect(() => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    getMe()
      .then((res) => setUser(res.data.data))
      .catch(() => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  } else {
    setLoading(false);
  }
}, []);

useEffect(() => {
  if (!user) return;

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      logoutUser();
    }, TIMEOUT_MS);
  };

  const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
  activityEvents.forEach((event) =>
    window.addEventListener(event, resetTimer)
  );

  resetTimer(); // start the clock as soon as user is set

  return () => {
    clearTimeout(timerRef.current);
    activityEvents.forEach((event) =>
      window.removeEventListener(event, resetTimer)
    );
  };
}, [user]);

 const loginUser = (token, userData, rememberMe = true) => {
  if (rememberMe) {
    localStorage.setItem('token', token);
  } else {
    sessionStorage.setItem('token', token);
  }
  setUser(userData);
};

  const logoutUser = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);