import React, { useState } from 'react';
import { VideoProject } from '../../types';
import { ProjectCard } from './ProjectCard';
import { ChevronDown, ChevronRight, LucideIcon, RotateCcw, Trash2 } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';

interface ProjectListSectionProps {
  title: string;
  icon: LucideIcon;
  badgeColor: string;
  iconColor: string;
  projects: VideoProject[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  defaultExpanded?: boolean;
  emptyText?: string;
  variant?: 'card' | 'compact';
}

export const ProjectListSection: React.FC<ProjectListSectionProps> = ({
  title,
  icon: Icon,
  badgeColor,
  iconColor,
  projects,
  activeProjectId,
  onSelectProject,
  defaultExpanded = true,
  emptyText = 'No projects',
  variant = 'card',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { setProjectStatus, deleteProject } = useProjects();

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between transition group rounded-lg ${
          variant === 'compact'
            ? 'px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/40'
            : 'px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50'
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon className={`${variant === 'compact' ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${iconColor}`} />
          <span>{title}</span>
          <span className={`px-1.5 py-0.2 text-[10px] font-semibold rounded-full ${badgeColor}`}>
            {projects.length}
          </span>
        </div>
        <div className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition">
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </div>
      </button>

      {isExpanded && (
        <div className={`mt-1 flex flex-col ${variant === 'compact' ? 'gap-0.5 pl-2' : 'gap-1.5'}`}>
          {projects.length === 0 ? (
            <div className="px-3 py-2 text-center text-[11px] text-slate-400 dark:text-slate-600 rounded-lg">
              {emptyText}
            </div>
          ) : variant === 'compact' ? (
            projects.map(project => {
              const isSelected = project.id === activeProjectId;
              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className={`group relative flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer select-none ${
                    isSelected
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <span className="truncate flex-1 pr-2">{project.title}</span>

                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProjectStatus(project.id, 'active');
                      }}
                      className="p-1 text-slate-400 hover:text-sky-500 rounded transition"
                      title="Restore to Active"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                isSelected={project.id === activeProjectId}
                onSelect={() => onSelectProject(project.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
