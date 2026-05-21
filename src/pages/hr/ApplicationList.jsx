import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/shared/Sidebar";
import { getAllApplications } from "../../services/api";
import { FaFileAlt, FaSearch, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";

const hrLinks = [
  { path: "/hr/dashboard", label: "Dashboard", icon: <FaFileAlt /> },
  { path: "/hr/applications", label: "Applications", icon: <FaSearch /> },
];

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-700",
  UNDER_REVIEW: "bg-blue-100 text-blue-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const ApplicationList = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await getAllApplications();
        setApplications(res.data.data);
      } catch (error) {
        toast.error("Error fetching applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Filter by search
  const filtered = applications.filter((app) =>
    `${app.firstName} ${app.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar links={hrLinks} />

      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Applications
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Showing latest 10 applications sorted alphabetically
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-500">Loading applications...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">No applications found.</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr className="text-left text-gray-500 dark:text-gray-300">
                  <th className="px-6 py-4 font-medium">#</th>
                  <th className="px-6 py-4 font-medium">Full Name</th>
                  <th className="px-6 py-4 font-medium">National ID</th>
                  <th className="px-6 py-4 font-medium">Gender</th>
                  <th className="px-6 py-4 font-medium">School</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, index) => (
                  <tr
                    key={app.id}
                    className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">
                      {app.firstName} {app.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {app.nationalId}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {app.gender}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {app.schoolName}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/hr/applications/${app.id}`)}
                        className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 transition"
                      >
                        <FaEye />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationList;