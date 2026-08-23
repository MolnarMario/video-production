import React, { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { ProjectListSection } from '../projects/ProjectListSection';
import {
  PlayCircle,
  CheckCircle2,
  Archive,
  Search,
  Plus,
  X,
  FileJson,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenNewProject: () => void;
  onOpenBackup: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onCloseMobile,
  onOpenNewProject,
  onOpenBackup,
}) => {
  const {
    activeProjectId,
    setActiveProjectId,
    activeProjects,
    completedProjects,
    scrappedProjects,
    projects,
  } = useProjects();

  const [searchQuery, setSearchQuery] = useState('');

  const filterList = (list: typeof activeProjects) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.sections.some(s => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q))
    );
  };

  const filteredActive = filterList(activeProjects);
  const filteredCompleted = filterList(completedProjects);
  const filteredScrapped = filterList(scrappedProjects);

  const handleSelect = (id: string) => {
    setActiveProjectId(id);
    onCloseMobile();
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 bg-white dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800/80 flex flex-col transition-all duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Action & Search */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800/80 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onOpenNewProject();
                onCloseMobile();
              }}
              className="w-full py-1.5 px-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3 h-3 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter projects..."
              className="w-full pl-7 pr-6 py-1 text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Primary Active Projects Area */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          <ProjectListSection
            title="Active"
            icon={PlayCircle}
            iconColor="text-sky-500 dark:text-sky-400"
            badgeColor="bg-sky-500/10 text-sky-600 dark:text-sky-400"
            projects={filteredActive}
            activeProjectId={activeProjectId}
            onSelectProject={handleSelect}
            defaultExpanded={true}
            emptyText="No active projects."
            variant="card"
          />
        </div>

        {/* Bottom Collapsible Archive Area (Completed & Scrapped) */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 p-2 bg-slate-50/60 dark:bg-slate-950/40 space-y-1 shrink-0">
          <ProjectListSection
            title="Completed"
            icon={CheckCircle2}
            iconColor="text-emerald-500"
            badgeColor="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            projects={filteredCompleted}
            activeProjectId={activeProjectId}
            onSelectProject={handleSelect}
            defaultExpanded={false}
            emptyText="None"
            variant="compact"
          />

          <ProjectListSection
            title="Scrapped"
            icon={Archive}
            iconColor="text-slate-400 dark:text-slate-500"
            badgeColor="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            projects={filteredScrapped}
            activeProjectId={activeProjectId}
            onSelectProject={handleSelect}
            defaultExpanded={false}
            emptyText="None"
            variant="compact"
          />
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 shrink-0 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-500">
          <span>{projects.length} Total</span>
          <button
            type="button"
            onClick={onOpenBackup}
            className="hover:text-slate-700 dark:hover:text-slate-300 transition flex items-center gap-1"
          >
            <FileJson className="w-3 h-3 text-sky-500 dark:text-sky-400" />
            <span>JSON Backup</span>
          </button>
        </div>
      </aside>
    </>
  );
};
