import { useNavigate } from 'react-router-dom';
import { FaCog, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/authContex';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const dashboardPath =
    user?.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/hr/dashboard';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f1117]">
      <div className="text-center">
        <FaCog className="text-blue-500 text-6xl mx-auto mb-6 animate-spin-slow" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-3">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Nothing to configure here yet. Check back soon!
        </p>
        <button
          onClick={() => navigate(dashboardPath)}
          className="flex items-center gap-2 mx-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Settings;