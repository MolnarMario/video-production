import React from 'react';
import { VideoProject } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { ScriptSectionItem } from './ScriptSectionItem';
import { SECTION_PRESETS } from '../../utils/defaults';
import { Plus } from 'lucide-react';

interface ScriptSectionListProps {
  project: VideoProject;
}

export const ScriptSectionList: React.FC<ScriptSectionListProps> = ({ project }) => {
  const { addSection, reorderSections } = useProjects();
  const sections = [...project.sections].sort((a, b) => a.order - b.order);

  const filmedCount = sections.filter(s => s.filmed).length;
  const insertedCount = sections.filter(s => s.inserted).length;

  const handleAddDefault = () => {
    addSection(project.id, `Section ${sections.length + 1}`, '');
  };

  const handleAddPreset = (title: string) => {
    addSection(project.id, title, '');
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderSections(project.id, index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < sections.length - 1) {
      reorderSections(project.id, index, index + 1);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Script Sections
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            ({filmedCount}/{sections.length} filmed · {insertedCount}/{sections.length} inserted)
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddDefault}
          className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition flex items-center gap-1 border border-slate-200 dark:border-slate-700/60"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-[11px] text-slate-500 mr-1">Quick add:</span>
        {SECTION_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAddPreset(preset.title)}
            className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 transition"
          >
            +{preset.title}
          </button>
        ))}
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs">
          No script sections yet. Click &quot;Add Section&quot; or select a preset above.
        </div>
      ) : (
        <div className="space-y-2">
          {sections.map((section, idx) => (
            <ScriptSectionItem
              key={section.id}
              projectId={project.id}
              section={section}
              index={idx}
              totalSections={sections.length}
              onMoveUp={() => handleMoveUp(idx)}
              onMoveDown={() => handleMoveDown(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
