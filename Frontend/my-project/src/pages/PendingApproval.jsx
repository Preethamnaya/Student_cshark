import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Clock } from 'lucide-react';

const PendingApproval = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-lg text-center border border-slate-700">
        <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Account Pending</h2>
        <p className="text-slate-400 mb-6">
          Your account is waiting for administrator approval. Please check back later or contact admin.
        </p>
        <button
          onClick={logout}
          className="px-6 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;
