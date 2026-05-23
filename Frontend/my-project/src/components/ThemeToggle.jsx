import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon, Sparkles } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-2xl border bg-white/40 border-slate-200 hover:border-slate-300 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700 transition duration-300 text-slate-700 dark:text-slate-200 shadow-md group overflow-hidden"
      aria-label="Toggle dynamic theme settings"
      title="Toggle Light / Dark mode"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-center">
        {theme === 'dark' ? (
          <div className="flex items-center gap-1.5 animate-welcome-in">
            <Moon className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform duration-300 fill-indigo-400/20" />
            <span className="text-[11px] font-mono tracking-wider font-semibold uppercase text-indigo-400">Dark</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 animate-welcome-in">
            <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform duration-500 fill-amber-500/20" />
            <span className="text-[11px] font-mono tracking-wider font-semibold uppercase text-amber-600">Light</span>
          </div>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
