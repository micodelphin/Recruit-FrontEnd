import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/shared/Sidebar";
import { getAllApplications } from "../../services/api";
import { FaFileAlt, FaSearch, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";

/* ---------------- Sidebar Links ---------------- */
const hrLinks = [
  { path: "/hr/dashboard", label: "Dashboard", icon: <FaFileAlt /> },
  { path: "/hr/applications", label: "Applications", icon: <FaSearch /> },
];

/* ---------------- Status Colors ---------------- */
const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-700",
  UNDER_REVIEW: "bg-blue-100 text-blue-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const APPLICATIONS_PER_PAGE = 10;

const ApplicationList = () => {
  const navigate = useNavigate();

  /* ---------------- State ---------------- */
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- Fetch Data ---------------- */
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

  /* ---------------- Filter + Sort ---------------- */
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) =>
        `${app.firstName} ${app.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
      .sort((a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
        ),
      );
  }, [applications, search]);

  /* ---------------- Pagination ---------------- */
  const totalPages = Math.ceil(
    filteredApplications.length / APPLICATIONS_PER_PAGE,
  );

  const indexOfLast = currentPage * APPLICATIONS_PER_PAGE;
  const indexOfFirst = indexOfLast - APPLICATIONS_PER_PAGE;

  const paginatedApplications = filteredApplications.slice(
    indexOfFirst,
    indexOfLast,
  );

  /* reset page on search */
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* ---------------- UI ---------------- */
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar links={hrLinks} />

      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Applications
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Showing 10 applications per page (A–Z sorted)
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-500">Loading applications...</p>
        ) : filteredApplications.length === 0 ? (
          <p className="text-gray-500">No applications found.</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr className="text-left text-gray-500 dark:text-gray-300">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">National ID</th>
                  <th className="px-6 py-4">Gender</th>
                  <th className="px-6 py-4">School</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {paginatedApplications.map((app, index) => (
                  <tr
                    key={app.id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => navigate(`/hr/applications/${app.id}`)}
                  >
                    <td className="px-6 py-4 text-gray-500">
                      {indexOfFirst + index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">
                      <div className="flex items-center gap-3">
                        {app.photoUrl ? (
                          <img
                            src={app.photoUrl}
                            alt={`${app.firstName} ${app.lastName}`}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-200 dark:border-gray-600"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">
                              {app.firstName?.charAt(0)}
                              {app.lastName?.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span>
                          {app.firstName} {app.lastName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">{app.nationalId}</td>
                    <td className="px-6 py-4">{app.gender}</td>
                    <td className="px-6 py-4">{app.schoolName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {filteredApplications.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t dark:border-gray-700">
                <p className="text-sm text-gray-500">
                  Showing {indexOfFirst + 1} to{" "}
                  {Math.min(indexOfLast, filteredApplications.length)} of{" "}
                  {filteredApplications.length}
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "border"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationList;
