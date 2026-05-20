import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/authContex.jsx';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Applicant pages
import ApplicationForm from './pages/applicant/ApplicationForm';
import ApplicationStatus from './pages/applicant/ApplicationStatus';

// HR pages
import HRDashboard from './pages/hr/Dashboard';
import ApplicationList from './pages/hr/ApplicationList';
import ApplicationDetail from './pages/hr/ApplicationDetail';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Applicant routes */}
          <Route path="/apply" element={
            <ProtectedRoute roles={['APPLICANT']}>
              <ApplicationForm />
            </ProtectedRoute>
          } />
          <Route path="/my-application" element={
            <ProtectedRoute roles={['APPLICANT']}>
              <ApplicationStatus />
            </ProtectedRoute>
          } />

          {/* HR routes */}
          <Route path="/hr/dashboard" element={
            <ProtectedRoute roles={['HR']}>
              <HRDashboard />
            </ProtectedRoute>
          } />
          <Route path="/hr/applications" element={
            <ProtectedRoute roles={['HR']}>
              <ApplicationList />
            </ProtectedRoute>
          } />
          <Route path="/hr/applications/:id" element={
            <ProtectedRoute roles={['HR']}>
              <ApplicationDetail />
            </ProtectedRoute>
          } />

          {/* Super Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['SUPER_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['SUPER_ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Unauthorized page */}
          <Route path="/unauthorized" element={
            <div className="flex items-center justify-center h-screen">
              <p className="text-red-500 text-xl">
                You are not authorized to view this page.
              </p>
            </div>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;