import React, { useState, useEffect } from "react";
import Sidebar from "../../components/shared/Sidebar";
import { getDashboardStats } from "../../services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from "recharts";
import {
  FaUsers, FaFileAlt, FaCheckCircle,
  FaTimesCircle, FaUserShield, FaUserTie,
} from "react-icons/fa";
import {
  Card, Tab, TabGroup, TabList, TabPanel,
  TabPanels, List, ListItem,
} from '@tremor/react';
import toast from "react-hot-toast";
import { BounceLoader } from 'react-spinners';

const ROLE_COLORS  = ["#6366f1", "#8b5cf6", "#ec4899"];
const STATUS_COLORS = ["#10b981", "#ef4444"];

const adminLinks = [
  { path: "/admin/dashboard", label: "Dashboard",       icon: <FaFileAlt /> },
  { path: "/admin/users",     label: "User Management", icon: <FaUsers />   },
];

const roleColors = {
  APPLICANT:   "bg-blue-100 text-blue-700",
  HR:          "bg-purple-100 text-purple-700",
  SUPER_ADMIN: "bg-red-100 text-red-700",
};

const AdminDashboard = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data.data);
      } catch {
        toast.error("Error fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BounceLoader size={50} color="#3B82F6" />
      </div>
    );
  }

  const userRoleData = [
    { name: "Applicants",   value: stats?.users?.applicants  || 0 },
    { name: "HR Managers",  value: stats?.users?.hrManagers  || 0 },
    { name: "Super Admins", value: stats?.users?.superAdmins || 0 },
  ];

  const activeStatusData = [
    { name: "Active",   value: stats?.users?.active   || 0 },
    { name: "Inactive", value: stats?.users?.inactive || 0 },
  ];

  const statCards = [
    { label: "Total Users",    value: stats?.users?.total      || 0, icon: <FaUsers className="text-indigo-500 text-2xl" />,    bg: "bg-indigo-50"  },
    { label: "Active Users",   value: stats?.users?.active     || 0, icon: <FaCheckCircle className="text-green-500 text-2xl" />, bg: "bg-green-50"  },
    { label: "Inactive Users", value: stats?.users?.inactive   || 0, icon: <FaTimesCircle className="text-red-500 text-2xl" />,   bg: "bg-red-50"    },
    { label: "Applicants",     value: stats?.users?.applicants || 0, icon: <FaFileAlt className="text-blue-500 text-2xl" />,      bg: "bg-blue-50"   },
    { label: "HR Managers",    value: stats?.users?.hrManagers || 0, icon: <FaUserTie className="text-purple-500 text-2xl" />,    bg: "bg-purple-50" },
    { label: "Super Admins",   value: stats?.users?.superAdmins|| 0, icon: <FaUserShield className="text-rose-500 text-2xl" />,   bg: "bg-rose-50"   },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar links={adminLinks} />

      <div className="ml-64 flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">System user overview</p>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card) => (
            <div key={card.label} className={`${card.bg} rounded-xl p-5 flex items-center space-x-4 shadow-sm`}>
              <div>{card.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Users by Role Pie */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Users by Role</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={userRoleData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {userRoleData.map((_, i) => <Cell key={i} fill={ROLE_COLORS[i % ROLE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Active vs Inactive Pie */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Active vs Inactive</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={activeStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {activeStatusData.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Registrations Over Time — Tremor tabbed */}
          <Card className="!bg-white !shadow-sm rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Registrations Over Time</h2>
            <TabGroup>
              <TabList className="mt-2 border-t border-gray-200">
                <Tab className="px-4 text-sm text-gray-500 ui-selected:border-b-2 ui-selected:border-indigo-600">Last 6 Months</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={stats?.registrationsOverTime || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6b7280' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                      <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#1f2937' }} />
                      <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <List className="mt-3">
                    {(stats?.registrationsOverTime || []).map((item) => (
                      <ListItem key={item.month}>
                        <span className="text-sm text-gray-600">{item.month}</span>
                        <span className="font-medium text-gray-800">{item.count}</span>
                      </ListItem>
                    ))}
                  </List>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </Card>
        </div>

        {/* Bottom Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recently Registered Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recently Registered Users</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b dark:border-gray-700">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentUsers?.map((user) => (
                  <tr key={user.id} className="border-b dark:border-gray-700">
                    <td className="py-3 text-gray-800 dark:text-gray-200">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Audit Logs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
            {stats?.recentAuditLogs?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentAuditLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 border-b dark:border-gray-700 pb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold flex-shrink-0">
                      {log.user?.firstName?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        <span className="font-medium">
                          {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'}
                        </span>{' '}
                        {log.action.toLowerCase().replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</p>
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