import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { Clock, LogOut, Sparkles } from 'lucide-react';

const PendingApproval = () => {
  const { logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden px-4 theme-transition">
      
      {/* Floating Theme Selector top right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Dynamic Floating Background Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[130px] pointer-events-none animate-blob-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/10 dark:bg-purple-900/10 blur-[130px] pointer-events-none animate-blob-2" />

      {/* Decorative Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:opacity-20 pointer-events-none" />

      {/* Crystal Frosted sandglass panel */}
      <div className="max-w-md w-full bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800/80 text-center relative z-10 glass-glow-indigo theme-transition">
        
        <div className="relative mb-6 mx-auto w-20 h-20 flex items-center justify-center animate-float">
          <div className="absolute inset-0 bg-amber-500/25 dark:bg-amber-500/10 blur-xl rounded-full animate-pulse-slow" />
          <div className="relative p-5 bg-gradient-to-tr from-amber-500 to-amber-400 rounded-full shadow-lg shadow-amber-500/30 border border-amber-400/20">
            <Clock className="w-10 h-10 text-slate-950 animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 p-1 bg-indigo-500 text-white rounded-full shadow-md">
            <Sparkles className="w-3.5 h-3.5 fill-indigo-500" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Account Pending Review</h2>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
          Your student registration credentials are currently queued for administrator approval. Please check back shortly or get in touch with support.
        </p>
        
        <button
          onClick={logout}
          className="flex items-center justify-center mx-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl shadow-md transition duration-300 font-bold text-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4 mr-2 text-indigo-400" /> Sign Out Session
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;
