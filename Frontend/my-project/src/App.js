import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import PendingApproval from './pages/PendingApproval';
import ModuleView from './pages/ModuleView';

const PrivateRoute = ({ children, roleRequired }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;
  if (user.role === 'student' && user.status !== 'approved' && !window.location.pathname.includes('/pending')) {
    return <Navigate to="/pending" />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 relative overflow-hidden">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/pending" element={<PrivateRoute><PendingApproval /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute roleRequired="admin"><AdminDashboard /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute roleRequired="student"><StudentDashboard /></PrivateRoute>} />
            <Route path="/module/:id" element={<PrivateRoute roleRequired="student"><ModuleView /></PrivateRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
