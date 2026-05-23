import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Pause, 
  Lock, 
  Unlock, 
  Tv, 
  Terminal, 
  Cpu, 
  Award, 
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';

const ModuleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [module, setModule] = useState(null);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [videoProgress, setVideoProgress] = useState({}); // Stores completion percentage for each video index
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(120); // Default 120 seconds for demo simulation speed
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const activeVideo = module?.videos?.[activeVideoIdx];
  
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  
  const timerRef = useRef(null);

  useEffect(() => {
    fetchModule();
    return () => clearInterval(timerRef.current);
  }, [id]);

  const fetchModule = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/modules/${id}`);
      setModule(res.data);
      // Reset video controls
      setActiveVideoIdx(0);
      setIsPlaying(false);
      setCurrentTime(0);
      // Read local video progress if saved
      const savedProgress = localStorage.getItem(`progress_${id}`);
      if (savedProgress) {
        setVideoProgress(JSON.parse(savedProgress));
      } else {
        setVideoProgress({});
      }
    } catch (error) {
      console.error(error);
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    if (activeVideo) {
      setVideoDuration(activeVideo.durationMinutes * 60 || 120);
    }
  }, [activeVideo]);

  // Video progress ticking simulator
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const nextTime = prev + (1 * playbackSpeed);
          if (nextTime >= videoDuration) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            
            // Mark current video as fully complete
            const updatedProgress = { ...videoProgress, [activeVideoIdx]: 100 };
            setVideoProgress(updatedProgress);
            localStorage.setItem(`progress_${id}`, JSON.stringify(updatedProgress));
            
            alert(`You have completed: ${module.videos[activeVideoIdx].title}!`);
            return videoDuration;
          }
          
          // Calculate ongoing percentage
          const percent = Math.round((nextTime / videoDuration) * 100);
          const currentPercent = videoProgress[activeVideoIdx] || 0;
          if (percent > currentPercent) {
            const updatedProgress = { ...videoProgress, [activeVideoIdx]: percent };
            setVideoProgress(updatedProgress);
          }
          
          return nextTime;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, activeVideoIdx, videoDuration, playbackSpeed, videoProgress, module]);

  const handleVideoSelect = (idx) => {
    // A video is locked if all previous videos are not 100% completed
    let isLocked = false;
    for (let i = 0; i < idx; i++) {
      if ((videoProgress[i] || 0) < 100) {
        isLocked = true;
        break;
      }
    }

    if (isLocked) {
      alert("Lesson is locked. You must watch previous lessons to completion before unlocking this segment.");
      return;
    }

    setActiveVideoIdx(idx);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimelineClick = (e) => {
    // Block forward skipping / scrubbing!
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickedTime = (clickX / width) * videoDuration;
    
    // Allow rewinding, but restrict skipping ahead beyond watched limit
    const maxAllowedTime = ((videoProgress[activeVideoIdx] || 0) / 100) * videoDuration;
    
    if (clickedTime > maxAllowedTime + 2) {
      alert("Forward skipping is locked to verify student hours requirement (~80h). You must watch the session content sequentially.");
      return;
    }
    
    setCurrentTime(clickedTime);
  };

  const handleOptionChange = (questionIndex, option) => {
    setAnswers({ ...answers, [questionIndex]: option });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (Object.keys(answers).length < module.questions.length) {
          alert('Please answer all technical questions before submitting.');
          return;
      }

      // Keep record of submitted answers to compare
      setSubmittedAnswers(answers);

      const res = await axios.post(`${API_BASE_URL}/api/modules/${id}/submit`, {
        answers
      });
      setResult(res.data);
      
      // Auto-download certificate if passed!
      if (res.data.passed && res.data.certificateUrl) {
        setTimeout(() => {
          const downloadUrl = `${API_BASE_URL}${res.data.certificateUrl}?token=${localStorage.getItem('token')}`;
          
          // Trigger file download
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', `Certificate_${module.title.replace(/\s+/g, '_')}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          alert("Congratulations! You passed! Your professional certificate has been automatically downloaded to your local device.");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!module) return <div className="p-8 text-center text-slate-400">Retrieving C# workspace...</div>;

  // Check if all videos are fully completed
  const totalVideosCount = module.videos?.length || 0;
  const completedVideosCount = Object.keys(videoProgress).filter(k => videoProgress[k] === 100).length;
  const isAssessmentUnlocked = completedVideosCount === totalVideosCount;

  // Code Simulation helpers for premium visual IDE player
  const getSimulatedCode = () => {
    if (activeVideoIdx === 0) {
      return `using System;\n\nnamespace CSharpBasics\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            Console.WriteLine("Welcome to C-Shark Studio!");\n            double runtimePrecision = 1.0 / 3.0;\n            Console.WriteLine($"Double: {runtimePrecision}");\n        }\n    }\n}`;
    } else if (activeVideoIdx === 1) {
      return `using System;\n\nclass ArrayMaster\n{\n    static void Main()\n    {\n        int[] list = { 10, 20, 30, 40 };\n        foreach (int num in list) {\n            // Enumerators are strictly read-only!\n            Console.WriteLine($"Number: {num}");\n        }\n    }\n}`;
    } else if (activeVideoIdx === 2) {
      return `using System;\n\npublic interface IAdvanced\n{\n    void Execute();\n    private void LogHelper() => Console.WriteLine("C# Default method helper running.");\n}\n\nclass OOPEngine : IAdvanced {\n    public void Execute() => Console.WriteLine("Object Polymorphism dynamic binding.");\n}`;
    } else {
      return `using System;\nusing System.Threading.Tasks;\n\nclass AsyncMaster\n{\n    static async Task Main()\n    {\n        Console.WriteLine("Initiating async delay...");\n        await Task.Delay(2000);\n        Console.WriteLine("Thread unblocked asynchronously!");\n    }\n}`;
    }
  };

  const getSimulatedOutput = () => {
    const timeRatio = currentTime / videoDuration;
    if (timeRatio < 0.1) {
      return "> Compiler ready...\n> Waiting for execution trigger...";
    } else if (timeRatio < 0.5) {
      return `> dotnet build CSharpWorkspace.csproj\n> MSBuild version 17.8.0+a828d1200\n> Compiling code sources to intermediate language (MSIL)...\n> Build completed successfully (0 errors, 0 warnings).`;
    } else if (timeRatio < 0.9) {
      return `> dotnet run\n> Starting Common Language Runtime (CLR)...\n> Executing compiled AOT/JIT signatures...`;
    } else {
      if (activeVideoIdx === 0) {
        return `> dotnet run\nWelcome to C-Shark Studio!\nDouble: 0.3333333333333333\n\n> Process finished with exit code 0.`;
      } else if (activeVideoIdx === 1) {
        return `> dotnet run\nNumber: 10\nNumber: 20\nNumber: 30\nNumber: 40\n\n> Process finished with exit code 0.`;
      } else if (activeVideoIdx === 2) {
        return `> dotnet run\nObject Polymorphism dynamic binding.\n\n> Process finished with exit code 0.`;
      } else {
        return `> dotnet run\nInitiating async delay...\nThread unblocked asynchronously!\n\n> Process finished with exit code 0.`;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-16">
      
      {/* Decorative Blur */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-slate-400 hover:text-white mb-6 px-4 py-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-xl transition duration-300 font-medium text-xs group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" /> Back to Dashboard
        </button>

        {/* Header Block */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {module.title}
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 rounded-md">
                {module.difficulty}
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-3xl">
              {module.description}
            </p>
          </div>
          
          {/* Status Display Card */}
          <div className="bg-slate-950 border border-slate-800/80 px-5 py-3.5 rounded-2xl flex items-center gap-4 text-xs font-medium self-start md:self-auto shadow-inner">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-indigo-400" />
              <span>Lessons Watched:</span>
              <span className="text-white font-bold">{completedVideosCount} / {totalVideosCount}</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Status:</span>
              <span className={isAssessmentUnlocked ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {isAssessmentUnlocked ? "Exam Unlocked" : "In Progress"}
              </span>
            </div>
          </div>
        </div>

        {/* Video Learning Segment */}
        {!showAssessment ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Custom C# Studio Visual IDE Player (2 Columns) */}
            <div className="lg:col-span-2 flex flex-col space-y-6">
              
              {/* Premium Player Console */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
                
                {/* Visual Editor Workspace header */}
                <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-850 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span className="font-mono text-slate-300">C# Compiler Studio IDE — Lesson {activeVideoIdx + 1}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* Embedded YouTube video lesson player */}
                {activeVideo && (
                  <div className="relative aspect-video w-full bg-black border-b border-slate-850 overflow-hidden shadow-inner group">
                    <iframe
                      src={activeVideo.url ? (activeVideo.url.includes('?') ? `${activeVideo.url}&autoplay=0&controls=1&rel=0&modestbranding=1` : `${activeVideo.url}?autoplay=0&controls=1&rel=0&modestbranding=1`) : ''}
                      title={activeVideo.title}
                      className="absolute top-0 left-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Simulated C# Code Runner Canvas */}
                <div className="bg-[#0b0f19] p-6 font-mono text-sm leading-relaxed overflow-x-auto min-h-[220px] max-h-[300px] border-b border-slate-850 text-indigo-300 shadow-inner">
                  <pre className="text-xs sm:text-sm">{getSimulatedCode()}</pre>
                </div>

                {/* Mock Output Terminal */}
                <div className="bg-black/90 p-4 font-mono text-xs text-emerald-400 min-h-[90px] border-b border-slate-850 overflow-y-auto">
                  <span className="text-slate-500 font-bold block mb-1">=== RUNTIME COMPILER OUTPUT ===</span>
                  <pre className="whitespace-pre-wrap">{getSimulatedOutput()}</pre>
                </div>

                {/* Player Controls Interface */}
                <div className="p-4 bg-slate-950 flex flex-col gap-4">
                  
                  {/* Timeline progress indicator */}
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400 select-none">
                    <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
                    
                    {/* Scrubbing timeline */}
                    <div 
                      onClick={handleTimelineClick}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 h-2 rounded-full cursor-pointer relative transition-colors"
                    >
                      {/* Already Watched Progress indicator */}
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentTime / videoDuration) * 100}%` }}
                      />
                      {/* Dot locator */}
                      <div 
                        className="absolute w-3.5 h-3.5 bg-white border border-indigo-500 shadow rounded-full -top-0.5 -ml-1.5 transition-all"
                        style={{ left: `${(currentTime / videoDuration) * 100}%` }}
                      />
                    </div>
                    
                    <span>{Math.floor(videoDuration / 60)}:{(videoDuration % 60).toString().padStart(2, '0')}</span>
                  </div>

                  {/* Playback Buttons row */}
                  <div className="flex justify-between items-center">
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={togglePlay}
                        className="p-2.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-full shadow transition-all duration-200"
                        title={isPlaying ? "Pause simulation" : "Play simulation"}
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </button>

                      <span className="text-xs text-slate-400 font-medium">
                        {isPlaying ? "Learning active (monitoring watch progress)" : "Playback paused"}
                      </span>
                    </div>

                    {/* Speed Controls */}
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="text-slate-500 uppercase">Speed:</span>
                      {[1, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => setPlaybackSpeed(s)}
                          className={`px-2.5 py-1 rounded transition duration-200 ${playbackSpeed === s ? 'bg-indigo-500 text-white shadow-inner' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Locked/Unlocked Alert Info panel */}
              <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
                <Info className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1.5 text-xs text-slate-400">
                  <h4 className="font-bold text-white text-sm">Professional C# Standards Watch Policy</h4>
                  <p>
                    Scrubbing or forwarding beyond the watched threshold is automatically locked. You must play and complete the full simulation to log the target credit hours (representing 80-90 hours for the entire developer program).
                  </p>
                </div>
              </div>
            </div>

            {/* Side-panel: Video Lesson Outline (1 Column) */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 flex flex-col shadow-xl">
              <h2 className="text-lg font-bold tracking-tight text-white mb-4 pb-3 border-b border-slate-800/80 flex items-center gap-2">
                <Tv className="w-5 h-5 text-indigo-400" /> Module Syllabus
              </h2>

              {/* Videos listing */}
              <div className="space-y-3 flex-1 overflow-y-auto mb-6">
                {module.videos?.map((vid, index) => {
                  const isCompleted = (videoProgress[index] || 0) === 100;
                  const currentPercent = videoProgress[index] || 0;
                  const isActive = index === activeVideoIdx;

                  // Check locks
                  let isLocked = false;
                  for (let i = 0; i < index; i++) {
                    if ((videoProgress[i] || 0) < 100) {
                      isLocked = true;
                      break;
                    }
                  }

                  return (
                    <div 
                      key={index}
                      onClick={() => handleVideoSelect(index)}
                      className={`p-4 rounded-2xl border transition duration-300 flex items-center justify-between gap-4 select-none ${isActive ? 'bg-indigo-500/10 border-indigo-500/40 text-white' : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'} ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="space-y-1 flex-1">
                        <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                          {vid.title}
                        </h4>
                        <p className="text-[11px] text-slate-500">Duration: {vid.durationMinutes} minutes</p>
                        
                        {/* Inline progress bar */}
                        {!isLocked && (
                          <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                            <div 
                              className={`h-1 rounded-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                              style={{ width: `${currentPercent}%` }}
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Locking/unlocking state icon */}
                      <div>
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-slate-600" />
                        ) : isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Unlock className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grand unlock exam action */}
              <div>
                {isAssessmentUnlocked ? (
                  <button
                    onClick={() => setShowAssessment(true)}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-2xl font-bold tracking-wide shadow-lg shadow-emerald-500/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 animate-bounce"
                  >
                    <Sparkles className="w-4 h-4" /> Start Technical Assessment
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3.5 bg-slate-950 border border-slate-900 text-slate-600 rounded-2xl font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> Watch all lessons to unlock exam
                  </button>
                )}
              </div>

            </div>

          </div>
        ) : (
          
          /* Technical Tricky Assessment Panel */
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Header info */}
            <div className="p-6 bg-slate-950 border-b border-slate-850 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" /> Technical Assessment Console
              </h2>
              <span className="text-xs font-semibold px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md">
                75% score required to pass
              </span>
            </div>

            {/* Exam logic/results details */}
            <div 
              className="p-8 select-none"
              onCopy={(e) => {
                e.preventDefault();
                alert('Academic Integrity Warning: Copying exam content is strictly audited.');
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              {result ? (
                /* Scoring report block */
                <div className="space-y-8">
                  <div className={`p-6 rounded-2xl border ${result.passed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
                    <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                      {result.passed ? <CheckCircle2 className="w-7 h-7 text-emerald-400" /> : <XCircle className="w-7 h-7 text-rose-400" />}
                      {result.passed ? 'Certification Requirements Achieved!' : 'Platform Requirements Not Met'}
                    </h3>
                    <p className="text-base text-slate-300 mt-2">
                      Assessment complete. You answered <strong>{result.correctCount}</strong> out of <strong>{result.totalQuestions}</strong> questions correctly, achieving a score of <strong>{result.score}%</strong>.
                    </p>
                    
                    {result.passed && result.certificateUrl && (
                      <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
                        <a 
                          href={`${API_BASE_URL}${result.certificateUrl}&token=${localStorage.getItem('token')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-bold tracking-wide transition shadow shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                        >
                          <Award className="w-5 h-5" /> Download Professional Certificate
                        </a>
                        <span className="text-xs text-slate-400">Your browser has automatically triggered the PDF file transfer.</span>
                      </div>
                    )}
                  </div>

                  {/* Tricky Educational Explanations Segment */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Technical Analysis & Explanations</h4>
                    
                    {result.questions?.map((q, idx) => {
                      const isCorrect = submittedAnswers[idx] === q.correctAnswer;
                      return (
                        <div key={idx} className="p-6 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-4">
                          <div className="flex items-start gap-3">
                            {isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-rose-400 mt-1 flex-shrink-0" />
                            )}
                            <div className="space-y-1">
                              <p className="font-semibold text-slate-200">{idx + 1}. {q.questionText}</p>
                              <div className="text-xs mt-2 space-y-1.5">
                                <p className="text-slate-400">Your selection: <span className={isCorrect ? "text-emerald-400" : "text-rose-400"}>{submittedAnswers[idx]}</span></p>
                                {!isCorrect && <p className="text-slate-400">Correct standard: <span className="text-emerald-400 font-bold">{q.correctAnswer}</span></p>}
                              </div>
                            </div>
                          </div>

                          {/* Tricky explanation */}
                          <div className="p-4 bg-slate-900 border-l-4 border-indigo-500 rounded-r-xl space-y-1">
                            <h5 className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                              <Info className="w-3.5 h-3.5" /> Technical Explanation:
                            </h5>
                            <p className="text-xs text-slate-300 whitespace-pre-wrap">{q.explanation}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex gap-4">
                    {!result.passed && (
                      <button 
                        onClick={() => {
                          setResult(null);
                          setAnswers({});
                        }}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition font-medium text-sm"
                      >
                        Retake Technical Exam
                      </button>
                    )}
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="px-6 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition font-medium text-sm"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                /* Interactive quiz taking console */
                <form onSubmit={handleSubmit} className="space-y-8">
                  {module.questions.map((q, qIndex) => (
                    <div key={qIndex} className="p-6 bg-slate-950 border border-slate-800/80 rounded-2xl">
                      <p className="font-bold text-slate-200 text-base mb-4 leading-relaxed">
                        {qIndex + 1}. {q.questionText}
                      </p>
                      
                      <div className="space-y-3">
                        {q.options.map((opt, oIndex) => {
                          const isSelected = answers[qIndex] === opt;
                          return (
                            <label 
                              key={oIndex} 
                              className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition select-none ${isSelected ? 'bg-indigo-500/5 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'}`}
                            >
                              <input 
                                type="radio" 
                                name={`question-${qIndex}`} 
                                value={opt}
                                checked={isSelected}
                                onChange={() => handleOptionChange(qIndex, opt)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-800"
                              />
                              <span className="ml-3 text-sm">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 flex gap-4 justify-between">
                    <button 
                      type="button"
                      onClick={() => setShowAssessment(false)}
                      className="px-6 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl transition duration-200 font-medium text-sm"
                    >
                      Back to Video Player
                    </button>
                    <button 
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-bold tracking-wide transition shadow-lg shadow-indigo-600/10 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Submit Exam Console
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleView;
