import React from 'react';
import { VideoProject } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { PlatformCard } from './PlatformCard';
import { ALL_PLATFORMS, calculateProjectProgress } from '../../utils/progressCalculator';
import { CheckCheck } from 'lucide-react';

interface PublishingChecklistProps {
  project: VideoProject;
}

export const PublishingChecklist: React.FC<PublishingChecklistProps> = ({ project }) => {
  const { togglePlatformPublished, updateProject } = useProjects();
  const progress = calculateProjectProgress(project);

  const platforms = project.targetPlatforms && project.targetPlatforms.length > 0
    ? project.targetPlatforms
    : ALL_PLATFORMS;

  const handlePublishAll = () => {
    const updatedPublishing = { ...project.publishing };
    const now = Date.now();
    platforms.forEach(plat => {
      updatedPublishing[plat] = { published: true, publishedAt: now };
    });
    updateProject(project.id, { publishing: updatedPublishing });
  };

  const handleUnpublishAll = () => {
    const updatedPublishing = { ...project.publishing };
    platforms.forEach(plat => {
      updatedPublishing[plat] = { published: false, publishedAt: undefined };
    });
    updateProject(project.id, { publishing: updatedPublishing });
  };

  return (
    <div className="space-y-3">
      {/* Publishing Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Publishing Platforms
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            ({progress.publishedCount}/{platforms.length} published)
          </span>
        </div>

        {progress.publishedCount < platforms.length ? (
          <button
            type="button"
            onClick={handlePublishAll}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition flex items-center gap-1 border border-slate-200 dark:border-slate-700/60"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All Uploaded</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleUnpublishAll}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium transition border border-slate-200 dark:border-slate-700/60"
          >
            Reset
          </button>
        )}
      </div>

      {/* Grid of 5 Platform Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {platforms.map(platformKey => (
          <PlatformCard
            key={platformKey}
            platformKey={platformKey}
            status={project.publishing[platformKey] || { published: false }}
            onToggle={() => togglePlatformPublished(project.id, platformKey)}
          />
        ))}
      </div>
    </div>
  );
};
