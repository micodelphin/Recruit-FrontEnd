import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/shared/Sidebar";
import { getDashboardStats } from "../../services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from "recharts";
import {
  FaUsers, FaFileAlt, FaCheckCircle,
  FaTimesCircle, FaClock, FaUserShield,
} from "react-icons/fa";
import toast from "react-hot-toast";

import {
  BarChart as TremorBarChart,
  Card,
  List,
  ListItem,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';


const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];
const GENDER_COLORS = ["#6366f1", "#ec4899"];

const adminLinks = [
  { path: "/admin/dashboard", label: "Dashboard", icon: <FaFileAlt /> },
  { path: "/admin/users", label: "User Management", icon: <FaUsers /> },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  const applicationStatusData = [
    { name: "Pending", value: stats?.applications?.pending || 0 },
    { name: "Under Review", value: stats?.applications?.underReview || 0 },
    { name: "Approved", value: stats?.applications?.approved || 0 },
    { name: "Rejected", value: stats?.applications?.rejected || 0 },
  ];

  const genderData = [
    { name: "Male", value: stats?.genderBreakdown?.male || 0 },
    { name: "Female", value: stats?.genderBreakdown?.female || 0 },
  ];

  const userRoleData = [
    { name: "Applicants", value: stats?.users?.applicants || 0 },
    { name: "HR Managers", value: stats?.users?.hrManagers || 0 },
    { name: "Super Admins", value: stats?.users?.superAdmins || 0 },
  ];

  const statCards = [
    {
      label: "Total Users",
      value: stats?.users?.total || 0,
      icon: <FaUsers className="text-indigo-500 text-2xl" />,
      bg: "bg-indigo-50",
    },
    {
      label: "Total Applications",
      value: stats?.applications?.total || 0,
      icon: <FaFileAlt className="text-blue-500 text-2xl" />,
      bg: "bg-blue-50",
    },
    {
      label: "Approved",
      value: stats?.applications?.approved || 0,
      icon: <FaCheckCircle className="text-green-500 text-2xl" />,
      bg: "bg-green-50",
    },
    {
      label: "Rejected",
      value: stats?.applications?.rejected || 0,
      icon: <FaTimesCircle className="text-red-500 text-2xl" />,
      bg: "bg-red-50",
    },
    {
      label: "Pending",
      value: stats?.applications?.pending || 0,
      icon: <FaClock className="text-yellow-500 text-2xl" />,
      bg: "bg-yellow-50",
    },
    {
      label: "Active Users",
      value: stats?.users?.active || 0,
      icon: <FaUserShield className="text-purple-500 text-2xl" />,
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar links={adminLinks} />

      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Full system overview
        </p>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`${card.bg} rounded-xl p-5 flex items-center space-x-4 shadow-sm`}
            >
              <div>{card.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Application Status Pie */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Applications by Status
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {applicationStatusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gender Pie */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Applications by Gender
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={index} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* User Roles Bar */}
          {/* User Roles Tremor Tabbed Chart */}
<Card className="!bg-white !shadow-sm rounded-xl p-6">
  <h2 className="text-lg font-semibold text-gray-800 mb-4">
    Users by Role
  </h2>
  <TabGroup>
    <TabList className="mt-4 space-x-0 border-t border-gray-200">
      {[
        {
          name: 'Applicants',
          total: stats?.users?.applicants || 0,
          change: `${stats?.users?.active || 0} active`,
        },
        {
          name: 'HR & Admins',
          total: (stats?.users?.hrManagers || 0) + (stats?.users?.superAdmins || 0),
          change: `${stats?.users?.hrManagers || 0} HR`,
        },
      ].map((tab) => (
        <Tab
          key={tab.name}
          className="w-full px-4 text-left hover:bg-gray-50 ui-selected:border-b-2 ui-selected:border-indigo-600"
        >
          <p className="text-sm text-gray-500">{tab.name}</p>
          <p className="text-xl font-bold text-gray-800">{tab.total}</p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">{tab.change}</p>
        </Tab>
      ))}
    </TabList>

    <TabPanels>
      {[
        {
          name: 'Applicants',
          data: [
            { date: 'Total', Users: stats?.users?.applicants || 0 },
            { date: 'Active', Users: stats?.users?.active || 0 },
            { date: 'Inactive', Users: stats?.users?.inactive || 0 },
          ],
          details: [
            { name: 'Total Applicants', value: stats?.users?.applicants || 0, color: 'bg-indigo-500' },
            { name: 'Active', value: stats?.users?.active || 0, color: 'bg-emerald-500' },
            { name: 'Inactive', value: stats?.users?.inactive || 0, color: 'bg-red-500' },
          ],
        },
        {
          name: 'HR & Admins',
          data: [
            { date: 'HR Managers', Users: stats?.users?.hrManagers || 0 },
            { date: 'Super Admins', Users: stats?.users?.superAdmins || 0 },
          ],
          details: [
            { name: 'HR Managers', value: stats?.users?.hrManagers || 0, color: 'bg-purple-500' },
            { name: 'Super Admins', value: stats?.users?.superAdmins || 0, color: 'bg-red-500' },
          ],
        },
      ].map((panel) => (
        <TabPanel key={panel.name}>
          {/* Use recharts BarChart instead of Tremor to avoid dark issues */}
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={panel.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#6b7280' }}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#1f2937',
                }}
              />
              <Bar dataKey="Users" radius={[4, 4, 0, 0]}>
  {panel.data.map((entry, index) => (
    <Cell
      key={index}
      fill={
        entry.date === 'Active'
          ? '#10b981'
          : entry.date === 'Inactive'
          ? '#ef4444'
          : '#6366f1'
      }
    />
  ))}
</Bar>
            </BarChart>
          </ResponsiveContainer>

          <List className="mt-4">
            {panel.details.map((item) => (
              <ListItem key={item.name}>
                <div className="flex items-center space-x-2">
                  <span
                    className={`${item.color} h-2 w-3 rounded-full`}
                    aria-hidden={true}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-800">{item.value}</span>
              </ListItem>
            ))}
          </List>
        </TabPanel>
      ))}
    </TabPanels>
  </TabGroup>
</Card>
        </div>

        {/* Recent Applications and Audit Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Recent Applications
              </h2>
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
                    className="border-b dark:border-gray-700"
                  >
                    <td className="py-3 text-gray-800 dark:text-gray-200">
                      {app.firstName} {app.lastName}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : app.status === "UNDER_REVIEW"
                          ? "bg-blue-100 text-blue-700"
                          : app.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
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

          {/* Audit Logs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Recent Activity
            </h2>
            {stats?.recentAuditLogs?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentAuditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start space-x-3 border-b dark:border-gray-700 pb-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold flex-shrink-0">
                      {log.user?.firstName?.charAt(0) || "S"}
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        <span className="font-medium">
                          {log.user
                            ? `${log.user.firstName} ${log.user.lastName}`
                            : "System"}
                        </span>{" "}
                        {log.action.toLowerCase().replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;