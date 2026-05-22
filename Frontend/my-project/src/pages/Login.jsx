import React, { useState, useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, ShieldUser, User, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isBypassMode, setIsBypassMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/auth/google`, {
          access_token: tokenResponse.access_token
        });
        login(res.data.token, res.data.user);
      } catch (error) {
        console.error('Google Login Failed', error);
        alert('Google Login Failed');
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
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/admin`, {
        email,
        password
      });
      login(res.data.token, res.data.user);
    } catch (error) {
      alert('Invalid Admin Credentials');
    }
  };

  const handleMockStudentLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/mock-student`, {
        email: studentEmail,
        name: studentName
      });
      login(res.data.token, res.data.user);
    } catch (error) {
      alert('Mock Student Login Failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-10 rounded-2xl shadow-2xl border border-slate-700">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">NIE C-Shark</h2>
          <p className="mt-2 text-sm text-slate-400">
            Student Assessment Platform
          </p>
        </div>

        {isAdminMode ? (
          <form className="mt-8 space-y-6" onSubmit={handleAdminLogin}>
            <div className="text-center">
              <span className="px-3 py-1 text-xs font-semibold text-amber-400 bg-amber-400/10 rounded-full border border-amber-400/20">
                Admin Console
              </span>
            </div>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors"
              >
                Sign in as Admin
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(false);
                  setIsBypassMode(false);
                }}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        ) : isBypassMode ? (
          <form className="mt-8 space-y-6" onSubmit={handleMockStudentLogin}>
            <div className="text-center">
              <span className="px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-400/10 rounded-full border border-emerald-400/20">
                Offline Bypass Mode
              </span>
            </div>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Student Name (e.g., Jane Doe)"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Student Email (e.g., student@nie.edu.in)"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-colors"
              >
                Access Platform as Student
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(false);
                  setIsBypassMode(false);
                }}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6 flex flex-col items-center">
            <div className="w-full flex justify-center">
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-xl text-white font-semibold bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-blue-500/50 shadow-lg shadow-black/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden focus:outline-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
                <span className="relative z-10 font-medium tracking-wide">Sign in with Google</span>
              </button>
            </div>
            
            <div className="w-full border-t border-slate-700 my-4"></div>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-center text-center">
              <button
                type="button"
                onClick={() => setIsBypassMode(true)}
                className="flex items-center justify-center text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Sparkles className="w-4 h-4 mr-2" /> Developer Bypass
              </button>
              
              <button
                type="button"
                onClick={() => setIsAdminMode(true)}
                className="flex items-center justify-center text-sm text-slate-400 hover:text-white transition-colors"
              >
                <ShieldUser className="w-4 h-4 mr-2" /> Admin Access
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
