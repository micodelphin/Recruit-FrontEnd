import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/shared/Sidebar";
import { getDashboardStats } from "../../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaFileAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { BounceLoader } from "react-spinners";

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

const hrLinks = [
  { path: "/hr/dashboard", label: "Dashboard", icon: <FaFileAlt /> },
  { path: "/hr/applications", label: "Applications", icon: <FaSearch /> },
];

const HRDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data.data);
      } catch (error) {
        toast.error("Error fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Applications",
      value: stats?.applications?.total || 0,
      icon: <FaFileAlt className="text-indigo-500 text-2xl" />,
      bg: "bg-indigo-50 dark:bg-indigo-900/30",
    },
    {
      label: "Pending",
      value: stats?.applications?.pending || 0,
      icon: <FaClock className="text-yellow-500 text-2xl" />,
      bg: "bg-yellow-50 dark:bg-yellow-900/30",
    },
    {
      label: "Approved",
      value: stats?.applications?.approved || 0,
      icon: <FaCheckCircle className="text-green-500 text-2xl" />,
      bg: "bg-green-50 dark:bg-green-900/30",
    },
    {
      label: "Rejected",
      value: stats?.applications?.rejected || 0,
      icon: <FaTimesCircle className="text-red-500 text-2xl" />,
      bg: "bg-red-50 dark:bg-red-900/30",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BounceLoader size={50} color="#3B82F6" />
      </div>
    );
  }

  const statusData = [
    { name: "Pending", value: stats?.applications?.pending || 0 },
    { name: "Under Review", value: stats?.applications?.underReview || 0 },
    { name: "Approved", value: stats?.applications?.approved || 0 },
    { name: "Rejected", value: stats?.applications?.rejected || 0 },
  ];

  const genderData = [
    { name: "Male", value: stats?.genderBreakdown?.male || 0 },
    { name: "Female", value: stats?.genderBreakdown?.female || 0 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar links={hrLinks} />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          HR Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Overview of all applications
        </p>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`${card.bg} rounded-xl p-5 flex items-center space-x-4 shadow-sm`}
            >
              <div>{card.icon}</div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Applications by Status
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gender Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Applications by Gender per Month
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stats.monthlyGenderData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                barCategoryGap="30%"
                barGap={4}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(99,102,241,0.05)" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "13px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
                />
                <Bar
                  dataKey="Male"
                  name="Male"
                  fill="#bfdbfe"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Female"
                  name="Female"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Recent Applications
            </h2>
            <button
              onClick={() => navigate("/hr/applications")}
              className="text-sm text-indigo-600 hover:underline"
            >
              View all
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b dark:border-gray-700">
                <th className="pb-3">Name</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentApplications?.map((app) => (
                <tr
                  key={app.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => navigate(`/hr/applications/${app.id}`)}
                >
                  <td className="py-3 text-gray-800 dark:text-gray-200">
                    <div className="flex items-center gap-3">
                      {app.photoUrl ? (
                        <img
                          src={app.photoUrl}
                          alt={`${app.firstName} ${app.lastName}`}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-200 dark:border-gray-600 cursor-pointer"
                          onClick={() => setShowPhotoPopup(true)}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">
                            {app.firstName?.charAt(0)}
                            {app.lastName?.charAt(0)}
                          </span>
                        </div>
                      )}
                      {app.firstName} {app.lastName}
                    </div>

                    {showPhotoPopup && (
                      <div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
                        onClick={() => setShowPhotoPopup(false)}
                      >
                        <div
                          className="relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <img
                            src={app.photoUrl}
                            alt="Full Profile"
                            className="max-h-[80vh] max-w-[80vw] rounded-lg shadow-lg border-4 border-white"
                          />
                          <button
                            onClick={() => setShowPhotoPopup(false)}
                            className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded-md shadow hover:bg-gray-200"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-3 text-gray-800 dark:text-gray-200">
                    {app.firstName} {app.lastName}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : app.status === "UNDER_REVIEW"
                            ? "bg-blue-100 text-blue-700"
                            : app.status === "APPROVED"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
