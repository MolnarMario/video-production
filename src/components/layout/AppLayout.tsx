import React, { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ProjectDetailView } from '../projects/ProjectDetailView';
import { CreateProjectModal } from '../projects/CreateProjectModal';
import { ExportImportModal } from '../backup/ExportImportModal';
import { FontComparisonModal } from '../theme/FontComparisonModal';
import { Film, Plus } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { activeProject } = useProjects();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isFontsModalOpen, setIsFontsModalOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navigation Bar */}
      <Header
        onOpenNewProject={() => setIsCreateModalOpen(true)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenFonts={() => setIsFontsModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
      />

      {/* Main App Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          onOpenNewProject={() => setIsCreateModalOpen(true)}
          onOpenBackup={() => setIsBackupModalOpen(true)}
        />

        {/* Right Main Cockpit */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors">
          {activeProject ? (
            <ProjectDetailView project={activeProject} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sky-500 dark:text-sky-400 mb-4 shadow-sm">
                <Film className="w-12 h-12" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">No Project Selected</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-6">
                Choose a project from the sidebar to view its production pipeline or create a brand new video workflow.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Project</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modals & Overlay Portals */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ExportImportModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />

      <FontComparisonModal
        isOpen={isFontsModalOpen}
        onClose={() => setIsFontsModalOpen(false)}
      />
    </div>
  );
};
