import React from 'react';
import { VideoProject } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { calculateProjectProgress } from '../../utils/progressCalculator';
import { ProgressBar } from '../common/ProgressBar';
import { CheckCircle2, Film, MoreVertical, Archive, Trash2, RotateCcw } from 'lucide-react';

interface ProjectCardProps {
  project: VideoProject;
  isSelected: boolean;
  onSelect: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelected,
  onSelect,
}) => {
  const { setProjectStatus, deleteProject } = useProjects();
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const progress = calculateProjectProgress(project);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleStatusChange = (e: React.MouseEvent, newStatus: 'active' | 'completed' | 'scrapped') => {
    e.stopPropagation();
    setShowMenu(false);
    setProjectStatus(project.id, newStatus);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    deleteProject(project.id);
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col p-2.5 rounded-xl border transition cursor-pointer select-none ${
        isSelected
          ? 'bg-sky-50 dark:bg-slate-800/90 border-sky-500/50 text-slate-900 dark:text-slate-100 shadow-sm'
          : 'bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/80 border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700/80'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className={`p-1 rounded-md shrink-0 ${
            project.status === 'completed'
              ? 'text-emerald-500 dark:text-emerald-400'
              : project.status === 'scrapped'
              ? 'text-slate-400 dark:text-slate-500'
              : 'text-sky-500 dark:text-sky-400'
          }`}>
            {project.status === 'completed' ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Film className="w-3.5 h-3.5" />
            )}
          </div>
          <span className="text-xs font-semibold truncate leading-tight">
            {project.title}
          </span>
        </div>

        <span className="font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
          {progress.overallProgress}%
        </span>

        {/* 3-dot dropdown */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition"
            title="Options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 z-30 w-40 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl">
              {project.status !== 'active' && (
                <button
                  onClick={(e) => handleStatusChange(e, 'active')}
                  className="w-full px-3 py-1.5 text-xs text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <RotateCcw className="w-3 h-3 text-sky-500 dark:text-sky-400" />
                  Move to Active
                </button>
              )}
              {project.status !== 'completed' && (
                <button
                  onClick={(e) => handleStatusChange(e, 'completed')}
                  className="w-full px-3 py-1.5 text-xs text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                  Mark Completed
                </button>
              )}
              {project.status !== 'scrapped' && (
                <button
                  onClick={(e) => handleStatusChange(e, 'scrapped')}
                  className="w-full px-3 py-1.5 text-xs text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Archive className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                  Scrap Project
                </button>
              )}
              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
              <button
                onClick={handleDelete}
                className="w-full px-3 py-1.5 text-xs text-left text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2">
        <ProgressBar progress={progress.overallProgress} size="xs" />
      </div>
    </div>
  );
};
