import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Video,
  FileJson,
  Menu,
  Sun,
  Moon,
  Type,
} from 'lucide-react';

interface HeaderProps {
  onOpenNewProject: () => void;
  onOpenBackup: () => void;
  onOpenFonts: () => void;
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBackup,
  onOpenFonts,
  onToggleSidebar,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="py-3 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0 z-20 transition-colors">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          title="Toggle Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <Video className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Video Production Tracker
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Font Comparison Modal Trigger */}
        <button
          type="button"
          onClick={onOpenFonts}
          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
          title="Compare and Switch Fonts"
        >
          <Type className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          <span>Fonts</span>
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-600" />
              <span>Dark</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenBackup}
          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
          title="Backup & Restore JSON"
        >
          <FileJson className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
          <span>Backup / Restore</span>
        </button>
      </div>
    </header>
  );
};
