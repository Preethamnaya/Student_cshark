import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
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
  const { theme } = useContext(ThemeContext);
  const [modules, setModules] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchModules();
    
    // Start exit animation after 3.4 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3405);

    // Completely unmount the welcome modal after 4 seconds
    const hideTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 4000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden theme-transition">
      
      {/* Dynamic Pop-up Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-slate-950/80 backdrop-blur-md theme-transition">
          <div className={`relative max-w-lg w-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800/80 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center overflow-hidden theme-transition ${isExiting ? 'animate-welcome-out' : 'animate-welcome-in'}`}>
            {/* Pulsing glow background inside the modal */}
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
            
            {/* Double ring layout with logo badge inside */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse-slow" />
              <div className="relative p-5 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-full shadow-lg shadow-indigo-500/30 border border-indigo-400/20 animate-float">
                <GraduationCap className="w-12 h-12 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 p-1 bg-amber-500 text-slate-950 rounded-full shadow-md">
                <Sparkles className="w-4 h-4 fill-slate-950" />
              </div>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
              Welcome back to <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-emerald-400 bg-clip-text text-transparent">C-Shark Academy</span>
            </h2>
            
            <p className="text-xl font-medium text-indigo-600 dark:text-indigo-200 mb-4">
              {user?.name || 'Developer'}
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Your customized software environment is fully compiled and ready. Let's write some high-performance C# code today!
            </p>

            <div className="mt-8 flex gap-1.5 justify-center">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="text-[11px] font-mono text-indigo-500 dark:text-slate-500 tracking-widest uppercase">System Bypass Authorized</span>
            </div>
          </div>
        </div>
      )}

      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 dark:bg-indigo-900/10 blur-[120px] pointer-events-none animate-blob-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/5 dark:bg-emerald-900/10 blur-[120px] pointer-events-none animate-blob-2" />
      
      {/* Decorative Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Sleek Premium Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-slate-200 dark:border-slate-800/80 theme-transition">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400/20">
              <GraduationCap className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Welcome back, {user?.name}
                </h1>
                <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
                Your portal to C# software mastery & architectural design.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-start">
            <ThemeToggle />
            
            <button 
              onClick={logout} 
              className="flex items-center px-4 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition duration-300 font-medium text-sm shadow-sm theme-transition"
            >
              <LogOut className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" /> Logout Session
            </button>
          </div>
        </header>

        {/* Dashboard Premium Stats Widgets */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Hours Completed */}
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-lg relative group overflow-hidden glass-glow-indigo">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">Training Duration</span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{hoursCompleted} / <span className="text-slate-400 dark:text-slate-500">{totalCourseHours} hrs</span></h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Targeting 80-90 hours for full course mastery</p>
              
              {/* Stats progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-850 rounded-full h-1.5 mt-3 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (hoursCompleted / totalCourseHours) * 100)}%` }}
                />
              </div>
            </div>
            <div className="p-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl relative z-10">
              <Clock className="w-8 h-8" />
            </div>
          </div>

          {/* Card 2: Certificates Unlocked */}
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-lg relative group overflow-hidden glass-glow-emerald">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">Credentials Unlocked</span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{certificatesEarned} / <span className="text-slate-400 dark:text-slate-500">{modules.length}</span></h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Verify assessments and download certificates</p>
              
              {/* Stats progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-850 rounded-full h-1.5 mt-3 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (certificatesEarned / modules.length) * 100)}%` }}
                />
              </div>
            </div>
            <div className="p-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl relative z-10">
              <Award className="w-8 h-8" />
            </div>
          </div>

          {/* Card 3: Overall Progress */}
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-lg relative group overflow-hidden glass-glow-amber">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-semibold tracking-wider text-rose-600 dark:text-rose-400 uppercase">Total Progress</span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{overallProgressPercent}%</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Maintain &gt;75% score to unlock certificates</p>
              
              {/* Stats progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-850 rounded-full h-1.5 mt-3 overflow-hidden">
                <div 
                  className="bg-rose-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${overallProgressPercent}%` }}
                />
              </div>
            </div>
            <div className="p-4 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl relative z-10">
              <Flame className="w-8 h-8" />
            </div>
          </div>

        </section>

        {/* Course Modules Segment */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-500 dark:text-indigo-400" /> C# Professional Modules
          </h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm theme-transition">
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
              difficultyBadge = 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/30';
            } else if (module.difficulty === 'Medium') {
              difficultyBadge = 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/30';
            } else {
              difficultyBadge = 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/30';
            }

            return (
              <div 
                key={module._id} 
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col group"
              >
                <div className="p-6 flex-1 flex flex-col">
                  {/* Module Header Elements */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold tracking-wide rounded-md border ${difficultyBadge}`}>
                      {module.difficulty}
                    </span>
                    {passed ? (
                      <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/30 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Complete
                      </span>
                    ) : completed ? (
                      <span className="flex items-center text-xs font-semibold text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/30 px-2 py-0.5 rounded-md">
                        Failed ({completed.score}%)
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-xl font-black text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-1">
                    {module.description}
                  </p>
                  
                  {/* Hours & Videos Metadata */}
                  <div className="grid grid-cols-2 gap-4 py-3.5 border-t border-b border-slate-200 dark:border-slate-800/80 mb-6 text-xs text-slate-500 dark:text-slate-400 theme-transition">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                      <span>{module.studyHours} Hours Course</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      <span>{module.videos?.length || 0} Lessons to Watch</span>
                    </div>
                  </div>

                  {completed && (
                    <div className="mb-4 text-sm font-semibold text-slate-500 dark:text-slate-400 flex justify-between items-center">
                      <span>Highest Score:</span>
                      <span className={passed ? 'text-emerald-500 font-bold' : 'text-rose-550 font-bold dark:text-rose-400'}>
                        {completed.score}%
                      </span>
                    </div>
                  )}

                  {/* Actions segment */}
                  <div className="flex gap-3 mt-auto">
                    <button 
                      onClick={() => navigate(`/module/${module._id}`)}
                      className="flex-1 flex justify-center items-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-bold transition shadow-md shadow-indigo-600/10 text-sm hover:scale-[1.02] active:scale-[0.98] duration-200"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" /> {completed ? 'Retake assessment' : 'Start lessons'}
                    </button>
                    {passed && completed.certificateUrl && (
                      <a 
                        href={`${API_BASE_URL}${completed.certificateUrl}?token=${localStorage.getItem('token')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex justify-center items-center px-3.5 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white rounded-xl transition duration-200 text-sm hover:scale-[1.02] active:scale-[0.98] theme-transition"
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

        {/* Academic Mentorship & Technical Support Widget */}
        <footer className="mt-16 bg-white/70 dark:bg-slate-900/30 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 p-8 rounded-3xl relative overflow-hidden group theme-transition">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-indigo-500/5 dark:bg-indigo-900/5 blur-[100px] pointer-events-none group-hover:bg-indigo-500/10 dark:group-hover:bg-indigo-900/10 transition-colors duration-500" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Academic Mentorship & Technical Support</h3>
              </div>
              <p className="text-slate-550 dark:text-slate-400 text-sm max-w-2xl">
                Stuck on a tricky C# architectural constraint or intermediate language compile puzzle? Reach out to our program director for 1-on-1 mentorship.
              </p>
            </div>
            
            <a 
              href="mailto:aprretham@gmail.com" 
              className="inline-flex items-center px-6 py-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-white rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition duration-300 font-semibold text-sm shadow-md gap-2 theme-transition"
            >
              Contact Support: aprretham@gmail.com
              <ArrowRight className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            </a>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default StudentDashboard;
