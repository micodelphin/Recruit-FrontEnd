import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/shared/Sidebar";
import { getAllApplications } from "../../services/api";
import { FaFileAlt, FaSearch } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

const hrLinks = [
  { path: "/hr/dashboard", label: "Dashboard", icon: <FaFileAlt /> },
  { path: "/hr/applications", label: "Applications", icon: <FaSearch /> },
];

const statusColors = {
  PENDING:      "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  UNDER_REVIEW: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  APPROVED:     "bg-green-500/20 text-green-400 border border-green-500/30",
  REJECTED:     "bg-red-500/20 text-red-400 border border-red-500/30",
};

const APPLICATIONS_PER_PAGE = 10;

const ApplicationList = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) =>
        `${app.firstName} ${app.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      );
  }, [applications, search]);

  const totalPages = Math.ceil(filteredApplications.length / APPLICATIONS_PER_PAGE);
  const indexOfLast = currentPage * APPLICATIONS_PER_PAGE;
  const indexOfFirst = indexOfLast - APPLICATIONS_PER_PAGE;
  const paginatedApplications = filteredApplications.slice(indexOfFirst, indexOfLast);

  useEffect(() => { setCurrentPage(1); }, [search]);

  return (
  <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f1117]">
    <Sidebar links={hrLinks} />

    <div className="ml-64 flex-1 p-8">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Applications</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Showing {APPLICATIONS_PER_PAGE} applications per page (A–Z sorted)</p>

      {/* Card */}
      <div className="bg-white dark:bg-[#1a1d27] rounded-2xl shadow-xl overflow-hidden">

        {/* Search */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-gray-800 dark:text-white font-semibold text-lg">All Applications</h2>
          <div className="relative w-72">
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-[#0f1117] border border-gray-300 dark:border-white/10 rounded-lg text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <ClipLoader size={40} color="#3B82F6" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <p className="text-gray-500 text-center py-20">No applications found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-500 border-b border-gray-200 dark:border-white/10">
                <th className="px-6 py-4 font-medium">#</th>
                <th className="px-6 py-4 font-medium">Combination</th>
                <th className="px-6 py-4 font-medium">Full Name</th>
                <th className="px-6 py-4 font-medium">National ID</th>
                <th className="px-6 py-4 font-medium">Gender</th>
                <th className="px-6 py-4 font-medium">School</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedApplications.map((app, index) => (
                <tr
                  key={app.id}
                  onClick={() => navigate(`/hr/applications/${app.id}`)}
                  className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition"
                >
                  <td className="px-6 py-4 text-gray-400 dark:text-gray-500">{indexOfFirst + index + 1}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{app.combination}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {app.photoUrl ? (
                        <img
                          src={app.photoUrl}
                          alt={`${app.firstName} ${app.lastName}`}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-200 dark:border-white/10"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">
                            {app.firstName?.charAt(0)}{app.lastName?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="text-gray-800 dark:text-white font-medium">{app.firstName} {app.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{app.nationalId}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{app.gender}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{app.schoolName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && filteredApplications.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-white/10">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredApplications.length)} of {filteredApplications.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 transition"
              >
                ← Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default ApplicationList;