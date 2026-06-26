import React, { useState, useEffect } from "react";
import Sidebar from "../../components/shared/Sidebar";
import {
  getAllUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  resetUserPassword,
} from "../../services/api";
import {
  FaUsers,
  FaFileAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaKey,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { BounceLoader } from 'react-spinners';

const adminLinks = [
  { path: "/admin/dashboard", label: "Dashboard", icon: <FaFileAlt /> },
  { path: "/admin/users", label: "User Management", icon: <FaUsers /> },
];

const roleColors = {
  APPLICANT: "bg-blue-100 text-blue-700",
  HR: "bg-purple-100 text-purple-700",
  SUPER_ADMIN: "bg-red-100 text-red-700",
};

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "HR",
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});
  const [resetModal, setResetModal] = useState(null); // holds the user being reset
  const [newPassword, setNewPassword] = useState("");
  const [resetSaving, setResetSaving] = useState(false);
  const usersPerPage = 10;

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.data);
    } catch (error) {
      toast.error("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / usersPerPage);
  const paginatedUsers = filtered.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.firstName.trim())
      errors.firstName = "First name is required.";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required.";
    if (!formData.email.trim()) errors.email = "Email is required.";
    if (!editingUser && !formData.password.trim()) {
      errors.password = "Password is required.";
    }
    if (!formData.role) errors.role = "Role is required.";
    return errors;
  };

  const openCreate = () => {
    setEditingUser(null);
    setFormData(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      role: user.role,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSave = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
        });
        toast.success("User updated successfully.");
      } else {
        await createUser(formData);
        toast.success("User created successfully.");
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      const message = error.response?.data?.message || "Error saving user.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await toggleUserStatus(user.id);
      toast.success(
        `User ${user.isActive ? "deactivated" : "activated"} successfully.`,
      );
      fetchUsers();
    } catch (error) {
      const message = error.response?.data?.message || "Error updating status.";
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      toast.success("User deleted successfully.");
      setDeleteConfirm(null);
      fetchUsers();
    } catch (error) {
      const message = error.response?.data?.message || "Error deleting user.";
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar links={adminLinks} />

      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Manage all system users
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
          >
            <FaPlus />
            <span>Add User</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
    <BounceLoader size={40} color="#3B82F6" />
  </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr className="text-left text-gray-500 dark:text-gray-300">
                  <th className="px-6 py-4 font-medium">#</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4 text-gray-500">
                      {(currentPage - 1) * usersPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}
                      >
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {/* Edit */}
                        <button
                          onClick={() => openEdit(user)}
                          className="text-indigo-600 hover:text-indigo-800 transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`transition ${
                            user.isActive
                              ? "text-green-600 hover:text-green-800"
                              : "text-gray-400 hover:text-gray-600"
                          }`}
                          title={user.isActive ? "Deactivate" : "Activate"}
                        >
                          {user.isActive ? (
                            <FaToggleOn size={18} />
                          ) : (
                            <FaToggleOff size={18} />
                          )}
                        </button>

                        {/* Reset Password — only for HR and SUPER_ADMIN */}
                        {user.role !== "APPLICANT" && (
                          <button
                            onClick={() => {
                              setResetModal(user);
                              setNewPassword("");
                            }}
                            className="text-yellow-500 hover:text-yellow-700 transition"
                            title="Reset Password"
                          >
                            <FaKey />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t dark:border-gray-700">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
                  {Math.min(currentPage * usersPerPage, filtered.length)} of{" "}
                  {filtered.length} users
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm rounded-lg transition ${
                          currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              {editingUser ? "Edit User" : "Create New User"}
            </h2>

            <div className="space-y-4">
              {/* First Name and Last Name */}
              <div className="flex space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm ${
                      formErrors.firstName
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="First name"
                  />
                  {formErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.firstName}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm ${
                      formErrors.lastName
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Last name"
                  />
                  {formErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

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

              {/* Password — only for create */}
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm ${
                      formErrors.password
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Password"
                  />
                  {formErrors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.password}
                    </p>
                  )}
                </div>
              )}

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="APPLICANT">Applicant</option>
                  <option value="HR">HR Manager</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm disabled:opacity-60"
              >
                {saving ? "Saving..." : editingUser ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
      {resetModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-sm">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Reset Password</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
        Set a new password for{' '}
        <span className="font-medium text-gray-800 dark:text-white">
          {resetModal.firstName} {resetModal.lastName}
        </span>
      </p>
      <input
        type="password"
        placeholder="New password (min 8 characters)"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white text-sm"
      />
      <div className="flex space-x-3">
        <button
          onClick={() => setResetModal(null)}
          className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
        >
          Cancel
        </button>
        <button
          disabled={resetSaving}
          onClick={async () => {
            if (!newPassword || newPassword.length < 8) {
              toast.error('Password must be at least 8 characters.');
              return;
            }
            setResetSaving(true);
            try {
              await resetUserPassword(resetModal.id, { newPassword });
              toast.success('Password reset successfully.');
              setResetModal(null);
            } catch (err) {
              toast.error(err?.response?.data?.message || 'Error resetting password.');
            } finally {
              setResetSaving(false);
            }
          }}
          className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition text-sm disabled:opacity-60"
        >
          {resetSaving ? 'Resetting...' : 'Reset'}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default UserManagement;
