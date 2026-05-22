import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import PendingApproval from './pages/PendingApproval';
import ModuleView from './pages/ModuleView';

const PrivateRoute = ({ children, roleRequired }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;
  if (user.role === 'student' && user.status !== 'approved' && !window.location.pathname.includes('/pending')) {
    return <Navigate to="/pending" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/pending" element={<PrivateRoute><PendingApproval /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute roleRequired="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute roleRequired="student"><StudentDashboard /></PrivateRoute>} />
          <Route path="/module/:id" element={<PrivateRoute roleRequired="student"><ModuleView /></PrivateRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
