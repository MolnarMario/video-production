import React, { useState } from 'react';
import { VideoProject } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { calculateProjectProgress } from '../../utils/progressCalculator';
import { ScriptSectionList } from '../script/ScriptSectionList';
import { PublishingChecklist } from '../publishing/PublishingChecklist';
import { ProgressBar } from '../common/ProgressBar';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  CheckCircle2,
  Archive,
  Trash2,
  RotateCcw,
  Check,
  Sparkles,
} from 'lucide-react';

interface ProjectDetailViewProps {
  project: VideoProject;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project }) => {
  const { updateProject, setProjectStatus, deleteProject } = useProjects();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.title);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descInput, setDescInput] = useState(project.description || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showScrapConfirm, setShowScrapConfirm] = useState(false);

  const progress = calculateProjectProgress(project);

  const handleTitleSubmit = () => {
    if (titleInput.trim() && titleInput !== project.title) {
      updateProject(project.id, { title: titleInput.trim() });
    } else {
      setTitleInput(project.title);
    }
    setIsEditingTitle(false);
  };

  const handleDescSubmit = () => {
    updateProject(project.id, { description: descInput.trim() || undefined });
    setIsEditingDesc(false);
  };

  const handleStatusChange = (status: 'active' | 'completed' | 'scrapped') => {
    setProjectStatus(project.id, status);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 px-6 py-6 lg:px-12 lg:py-8 space-y-6 max-w-5xl mx-auto w-full transition-colors">
      {/* Top Banner for Completed / Scrapped Status */}
      {project.status === 'completed' && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">Project Completed! All tasks and publishing finished.</span>
          </div>
          <button
            onClick={() => handleStatusChange('active')}
            className="px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 bg-emerald-100 dark:bg-emerald-500/20 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 rounded-lg transition flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Re-open
          </button>
        </div>
      )}

      {project.status === 'scrapped' && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <Archive className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-semibold">Project Scrapped / Archived</span>
          </div>
          <button
            onClick={() => handleStatusChange('active')}
            className="px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30 rounded-lg transition flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Restore
          </button>
        </div>
      )}

      {/* Completion Ready Alert CTA when 100% finished */}
      {project.status === 'active' && progress.isFullyComplete && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-bold">100% Ready for Completion!</span>
          </div>
          <button
            onClick={() => handleStatusChange('completed')}
            className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mark as Completed
          </button>
        </div>
      )}

      {/* Clean Project Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-[260px] space-y-1.5">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSubmit();
                    if (e.key === 'Escape') {
                      setTitleInput(project.title);
                      setIsEditingTitle(false);
                    }
                  }}
                  autoFocus
                  className="w-full text-2xl font-bold bg-white dark:bg-slate-950 border border-sky-500/80 rounded-lg px-2.5 py-1 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
                <button
                  onClick={handleTitleSubmit}
                  className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <h1
                onClick={() => {
                  setTitleInput(project.title);
                  setIsEditingTitle(true);
                }}
                className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-400 transition cursor-pointer tracking-tight"
                title="Click to rename"
              >
                {project.title}
              </h1>
            )}

            {/* Description */}
            {isEditingDesc ? (
              <div className="flex items-start gap-2 pt-1">
                <textarea
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  onBlur={handleDescSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleDescSubmit();
                    }
                  }}
                  autoFocus
                  rows={2}
                  placeholder="Add notes or concept summary..."
                  className="w-full text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 border border-sky-500/80 rounded-lg p-2 focus:outline-none font-sans"
                />
                <button
                  onClick={handleDescSubmit}
                  className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded shrink-0"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p
                onClick={() => {
                  setDescInput(project.description || '');
                  setIsEditingDesc(true);
                }}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer"
              >
                {project.description || '+ Add concept or notes...'}
              </p>
            )}
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5">
            {project.status === 'active' && (
              <>
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-slate-700/60 transition flex items-center gap-1.5"
                  title="Mark project as completed"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Complete</span>
                </button>
                <button
                  onClick={() => setShowScrapConfirm(true)}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-amber-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700/60 transition flex items-center gap-1.5"
                  title="Scrap project"
                >
                  <Archive className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Scrap</span>
                </button>
              </>
            )}

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-rose-500/10 rounded-lg transition"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Minimalist Progress Strip */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Overall Progress</span>
            <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{progress.overallProgress}%</span>
          </div>
          <ProgressBar progress={progress.overallProgress} size="sm" />
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-500 pt-0.5">
            <span>Filming: {progress.filmedCount}/{progress.totalSections}</span>
            <span>Editing: {progress.insertedCount}/{progress.totalSections}</span>
            <span>Publishing: {progress.publishedCount}/{progress.targetPlatformCount}</span>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="space-y-6 pt-2">
        <ScriptSectionList project={project} />
        <PublishingChecklist project={project} />
      </div>

      {/* Scrap Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showScrapConfirm}
        title="Scrap Project?"
        message={`Move "${project.title}" to Scrapped? You can restore it at any time.`}
        confirmText="Scrap Project"
        variant="warning"
        onConfirm={() => {
          setShowScrapConfirm(false);
          handleStatusChange('scrapped');
        }}
        onCancel={() => setShowScrapConfirm(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Project Permanently?"
        message={`Permanently delete "${project.title}"? This cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        onConfirm={() => {
          setShowDeleteConfirm(false);
          deleteProject(project.id);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};
