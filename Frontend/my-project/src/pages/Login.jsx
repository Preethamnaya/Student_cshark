import React, { useState, useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { BookOpen, ShieldUser, Terminal, Sparkles, AlertCircle, GraduationCap } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Login = () => {
  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isBypassMode, setIsBypassMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE_URL}/api/auth/google`, {
          access_token: tokenResponse.access_token
        });
        login(res.data.token, res.data.user);
      } catch (error) {
        console.error('Google Login Failed', error);
        alert('Google Login Failed');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Auth Failed', error);
      alert('Google Authentication Failed');
    },
    prompt: 'select_account',
  });

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/admin`, {
        email,
        password
      });
      login(res.data.token, res.data.user);
    } catch (error) {
      alert('Invalid Admin Credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleMockStudentLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/mock-student`, {
        email: studentEmail,
        name: studentName
      });
      login(res.data.token, res.data.user);
    } catch (error) {
      alert('Mock Student Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden px-4 sm:px-6 lg:px-8 theme-transition">
      
      {/* Dynamic Floating Background Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[130px] pointer-events-none animate-blob-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/10 dark:bg-purple-900/10 blur-[130px] pointer-events-none animate-blob-2" />
      
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:opacity-20 pointer-events-none" />

      {/* Floating Theme Selector top right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Frosted Glassmorphic Login Container */}
      <div className="max-w-md w-full space-y-8 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800/80 relative z-10 glass-glow-indigo theme-transition">
        
        {/* Layered Geometric brand logo */}
        <div className="text-center">
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center animate-float">
            {/* Spinning decorative geometric background rings */}
            <div className="absolute inset-0 border-2 border-dashed border-indigo-500/20 dark:border-indigo-400/30 rounded-full animate-rotate-slow" />
            <div className="absolute inset-2 border border-slate-300 dark:border-slate-800 rounded-full" />
            <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/5 blur-xl rounded-full animate-pulse-slow" />
            
            {/* Double-layered glowing logo shield */}
            <div className="relative w-14 h-14 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 rounded-2xl shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-400/20">
              <GraduationCap className="h-8 w-8 text-white animate-pulse" />
            </div>
            
            <div className="absolute -top-1 -right-1 p-1 bg-amber-500 text-slate-950 rounded-full shadow-md">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              C-Shark Academy
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            Professional C# Software Assessment Academy
          </p>
        </div>

        {isAdminMode ? (
          <form className="mt-8 space-y-6" onSubmit={handleAdminLogin}>
            <div className="text-center">
              <span className="px-3.5 py-1 text-xs font-bold text-purple-600 bg-purple-500/10 dark:text-purple-400 dark:bg-purple-400/10 rounded-full border border-purple-200 dark:border-purple-400/20 tracking-wide uppercase">
                Admin Console
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 neon-border-purple text-sm transition-all"
                  placeholder="Admin Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 neon-border-purple text-sm transition-all"
                  placeholder="Console Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold rounded-xl shadow-lg shadow-purple-600/10 transition-all hover:scale-[1.02] active:scale-[0.98] duration-200 text-sm"
              >
                {loading ? "Authenticating Console..." : "Access Administrator Suite"}
              </button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(false);
                  setIsBypassMode(false);
                }}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
              >
                Return to Student Portal
              </button>
            </div>
          </form>
        ) : isBypassMode ? (
          <form className="mt-8 space-y-6" onSubmit={handleMockStudentLogin}>
            <div className="text-center">
              <span className="px-3.5 py-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-400/10 rounded-full border border-emerald-200 dark:border-emerald-400/20 tracking-wide uppercase">
                Developer Bypass Active
              </span>
            </div>
            
            {/* Terminal Styling for bypass form */}
            <div className="bg-slate-900/50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 font-mono text-xs text-slate-700 dark:text-indigo-300 space-y-4 shadow-inner theme-transition">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-900 text-slate-400 dark:text-slate-500">
                <Terminal className="w-4 h-4 text-emerald-500 dark:text-emerald-400 animate-pulse" />
                <span>MOCK_STUDENT_BYPASS_SHELL</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-500 dark:text-slate-500 mb-1.5">&gt; INPUT_STUDENT_NAME:</label>
                  <input
                    type="text"
                    required
                    disabled={loading}
                    className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 px-3.5 py-2.5 rounded-xl text-slate-900 dark:text-white font-mono placeholder-slate-300 dark:placeholder-slate-700 focus:outline-none focus:border-emerald-500/50 neon-border-indigo text-xs transition-colors"
                    placeholder="Enter Student Name..."
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-500 mb-1.5">&gt; INPUT_STUDENT_EMAIL:</label>
                  <input
                    type="email"
                    required
                    disabled={loading}
                    className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 px-3.5 py-2.5 rounded-xl text-slate-900 dark:text-white font-mono placeholder-slate-300 dark:placeholder-slate-700 focus:outline-none focus:border-emerald-500/50 neon-border-indigo text-xs transition-colors"
                    placeholder="Enter Student Email..."
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/10 transition-all hover:scale-[1.02] active:scale-[0.98] duration-200 text-sm"
              >
                {loading ? "Allocating Mock Profile..." : "Execute Bypass & Log In"}
              </button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(false);
                  setIsBypassMode(false);
                }}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
              >
                Return to Student Portal
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6 flex flex-col items-center">
            
            {/* Real Google OAuth Button */}
            <div className="w-full">
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-bold bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/50 shadow-md dark:shadow-lg dark:shadow-black/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden focus:outline-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 relative z-10" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="relative z-10 font-bold tracking-wide text-sm">{loading ? "Launching OAuth Session..." : "Sign in with Google"}</span>
              </button>
            </div>
            
            <div className="w-full flex items-center justify-between gap-4 py-2">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-600">Developer Options</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Quick Developer Bypass Links */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-center text-center">
              <button
                type="button"
                onClick={() => setIsBypassMode(true)}
                className="flex items-center justify-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
              >
                <Sparkles className="w-4 h-4 mr-1.5" /> Developer Bypass
              </button>
              
              <button
                type="button"
                onClick={() => setIsAdminMode(true)}
                className="flex items-center justify-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
              >
                <ShieldUser className="w-4 h-4 mr-1.5" /> Admin Console
              </button>
            </div>
          </div>
        )}
        
        {/* Bottom decorative academic note */}
        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-center text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-indigo-500/50" />
          <span>Authorized student and developer console only.</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
