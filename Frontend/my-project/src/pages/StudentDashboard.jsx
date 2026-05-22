import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { 
  BookOpen, 
  LogOut, 
  Award, 
  PlayCircle, 
  Clock, 
  GraduationCap, 
  CheckCircle2, 
  Flame, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/modules`);
      setModules(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCompletedData = (moduleId) => {
    return user?.completedModules?.find(m => m.moduleId === moduleId);
  };

  // Calculate statistics
  const totalCourseHours = modules.reduce((acc, m) => acc + (m.studyHours || 10), 0);
  
  const completedModulesList = modules.filter(m => {
    const completed = getCompletedData(m._id);
    return completed && completed.score >= 75;
  });

  const hoursCompleted = completedModulesList.reduce((acc, m) => acc + (m.studyHours || 10), 0);
  const certificatesEarned = completedModulesList.length;
  const overallProgressPercent = modules.length > 0 
    ? Math.round((completedModulesList.length / modules.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Sleek Premium Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400/20">
              <GraduationCap className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Welcome back, {user?.name}
                </h1>
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-slate-400 mt-1 text-sm sm:text-base">
                Your portal to C# software mastery & architectural design.
              </p>
            </div>
          </div>

          <button 
            onClick={logout} 
            className="flex items-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 hover:border-slate-700 transition duration-300 font-medium text-sm shadow-md"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout Session
          </button>
        </header>

        {/* Dashboard Premium Stats Widgets */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Hours Completed */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl flex items-center justify-between shadow-lg relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">Training Duration</span>
              <h3 className="text-3xl font-black text-white">{hoursCompleted} / <span className="text-slate-500">{totalCourseHours} hrs</span></h3>
              <p className="text-xs text-slate-400">Targeting 80-90 hours for full course mastery</p>
              
              {/* Stats progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
                <div 
                  className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (hoursCompleted / totalCourseHours) * 100)}%` }}
                />
              </div>
            </div>
            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl relative z-10">
              <Clock className="w-8 h-8" />
            </div>
          </div>

          {/* Card 2: Certificates Unlocked */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl flex items-center justify-between shadow-lg relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Credentials Unlocked</span>
              <h3 className="text-3xl font-black text-white">{certificatesEarned} / <span className="text-slate-500">{modules.length}</span></h3>
              <p className="text-xs text-slate-400">Verify assessments and download certificates</p>
              
              {/* Stats progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (certificatesEarned / modules.length) * 100)}%` }}
                />
              </div>
            </div>
            <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl relative z-10">
              <Award className="w-8 h-8" />
            </div>
          </div>

          {/* Card 3: Overall Progress */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl flex items-center justify-between shadow-lg relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-semibold tracking-wider text-rose-400 uppercase">Total Progress</span>
              <h3 className="text-3xl font-black text-white">{overallProgressPercent}%</h3>
              <p className="text-xs text-slate-400">Maintain &gt;75% score to unlock certificates</p>
              
              {/* Stats progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
                <div 
                  className="bg-rose-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${overallProgressPercent}%` }}
                />
              </div>
            </div>
            <div className="p-4 bg-rose-500/10 text-rose-400 rounded-2xl relative z-10">
              <Flame className="w-8 h-8" />
            </div>
          </div>

        </section>

        {/* Course Modules Segment */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" /> C# Professional Modules
          </h2>
          <span className="text-xs font-medium text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            6 Modules Seeding Active
          </span>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, idx) => {
            const completed = getCompletedData(module._id);
            const passed = completed && completed.score >= 75;

            // Difficulty Colors
            let difficultyBadge = '';
            if (module.difficulty === 'Easy') {
              difficultyBadge = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/30';
            } else if (module.difficulty === 'Medium') {
              difficultyBadge = 'text-amber-400 bg-amber-950/40 border-amber-800/30';
            } else {
              difficultyBadge = 'text-rose-400 bg-rose-950/40 border-rose-800/30';
            }

            return (
              <div 
                key={module._id} 
                className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-indigo-500/30 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-indigo-500/5 transition duration-300 flex flex-col group"
              >
                <div className="p-6 flex-1 flex flex-col">
                  {/* Module Header Elements */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold tracking-wide rounded-md border ${difficultyBadge}`}>
                      {module.difficulty}
                    </span>
                    {passed ? (
                      <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-800/30 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Complete
                      </span>
                    ) : completed ? (
                      <span className="flex items-center text-xs font-medium text-rose-400 bg-rose-950/50 border border-rose-800/30 px-2 py-0.5 rounded-md">
                        Failed ({completed.score}%)
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-300 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-1">
                    {module.description}
                  </p>
                  
                  {/* Hours & Videos Metadata */}
                  <div className="grid grid-cols-2 gap-4 py-3.5 border-t border-b border-slate-800/80 mb-6 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>{module.studyHours} Hours Course</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-emerald-400" />
                      <span>{module.videos?.length || 0} Lessons to Watch</span>
                    </div>
                  </div>

                  {completed && (
                    <div className="mb-4 text-sm font-medium text-slate-400 flex justify-between items-center">
                      <span>Highest Score:</span>
                      <span className={passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {completed.score}%
                      </span>
                    </div>
                  )}

                  {/* Actions segment */}
                  <div className="flex gap-3 mt-auto">
                    <button 
                      onClick={() => navigate(`/module/${module._id}`)}
                      className="flex-1 flex justify-center items-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-medium transition shadow-md shadow-indigo-600/10 text-sm hover:scale-[1.02] active:scale-[0.98] duration-200"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" /> {completed ? 'Retake assessment' : 'Start lessons'}
                    </button>
                    {passed && completed.certificateUrl && (
                      <a 
                        href={`${API_BASE_URL}${completed.certificateUrl}?token=${localStorage.getItem('token')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex justify-center items-center px-3.5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl transition duration-200 text-sm hover:scale-[1.02] active:scale-[0.98]"
                        title="Download Certificate to local device"
                      >
                        <Award className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
