import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { CheckCircle, XCircle, LogOut, ShieldAlert, Sparkles, GraduationCap } from 'lucide-react';
import { API_BASE_URL } from '../config';

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`);
      setStudents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/users/${id}/approve`);
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      if(window.confirm('Are you sure you want to reject and delete this user?')){
         await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`);
         fetchStudents();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden px-4 sm:px-6 lg:px-8 py-10 theme-transition">
      
      {/* Dynamic Floating Background Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 dark:bg-purple-900/10 blur-[130px] pointer-events-none animate-blob-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-900/10 blur-[130px] pointer-events-none animate-blob-2" />

      {/* Decorative Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Sleek Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 pb-8 border-b border-slate-200 dark:border-slate-800/80 theme-transition">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-tr from-purple-650 to-purple-500 dark:from-purple-600 dark:to-purple-500 rounded-2xl shadow-lg shadow-purple-500/20 ring-1 ring-purple-400/20">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
                Platform Administrative Review Board & Enrolment Systems.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-start">
            <ThemeToggle />
            
            <button 
              onClick={logout} 
              className="flex items-center px-4 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 transition duration-300 font-bold text-sm shadow-sm theme-transition"
            >
              <LogOut className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" /> Logout Session
            </button>
          </div>
        </header>

        {/* Main Frosted Glass Table Container */}
        <div className="glass-panel rounded-3xl overflow-hidden shadow-xl">
          
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/40 flex justify-between items-center theme-transition">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-650 dark:text-purple-450" /> Student Approvals
            </h2>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm theme-transition">
              {students.length} Accounts Found
            </span>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800/80 theme-transition">
            {students.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">No registered student accounts found in database.</p>
              </div>
            ) : (
              students.map(student => (
                <div key={student._id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-white/40 dark:hover:bg-slate-900/20 transition duration-300">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{student.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium font-mono">{student.email}</p>
                    
                    <div className="pt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border ${student.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-450 dark:border-emerald-800/30' : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-450 dark:border-amber-800/30'}`}>
                        {student.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {student.status === 'pending' && (
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => handleApprove(student._id)}
                        className="flex-1 sm:flex-initial flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-emerald-650 to-emerald-555 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-bold shadow-md shadow-emerald-500/10 transition duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                      </button>
                      <button 
                        onClick={() => handleReject(student._id)}
                        className="flex-1 sm:flex-initial flex items-center justify-center px-4 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 border border-red-200 dark:border-red-950/40 text-red-600 dark:text-red-400 rounded-xl font-bold shadow-sm transition duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm theme-transition"
                      >
                        <XCircle className="w-4 h-4 mr-2 animate-pulse" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
