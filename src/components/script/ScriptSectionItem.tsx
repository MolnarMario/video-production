import React, { useState } from 'react';
import { ScriptSection } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import {
  Video,
  Scissors,
  ChevronUp,
  ChevronDown,
  Trash2,
  Check,
} from 'lucide-react';

interface ScriptSectionItemProps {
  projectId: string;
  section: ScriptSection;
  index: number;
  totalSections: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const ScriptSectionItem: React.FC<ScriptSectionItemProps> = ({
  projectId,
  section,
  index,
  totalSections,
  onMoveUp,
  onMoveDown,
}) => {
  const { updateSection, deleteSection, toggleFilmed, toggleInserted } = useProjects();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(section.title);

  const wordCount = section.content.trim() ? section.content.trim().split(/\s+/).length : 0;

  const handleTitleSubmit = () => {
    if (titleInput.trim() && titleInput !== section.title) {
      updateSection(projectId, section.id, { title: titleInput.trim() });
    } else {
      setTitleInput(section.title);
    }
    setIsEditingTitle(false);
  };

  return (
    <div
      className={`group rounded-xl border transition duration-150 ${
        section.filmed && section.inserted
          ? 'bg-emerald-50/50 dark:bg-slate-900/60 border-emerald-300 dark:border-emerald-500/25'
          : section.filmed
          ? 'bg-sky-50/50 dark:bg-slate-900/60 border-sky-300 dark:border-sky-500/25'
          : 'bg-white dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/50 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80'
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800/60 gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500">
            {index + 1}.
          </span>

          {isEditingTitle ? (
            <div className="flex items-center gap-1.5 flex-1 max-w-sm">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSubmit();
                  if (e.key === 'Escape') {
                    setTitleInput(section.title);
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                className="w-full px-2 py-0.5 text-xs font-semibold bg-white dark:bg-slate-950 border border-sky-500 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none"
              />
              <button
                onClick={handleTitleSubmit}
                className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span
              onClick={() => setIsEditingTitle(true)}
              className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition cursor-pointer truncate"
              title="Click to rename"
            >
              {section.title}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Filmed Toggle */}
          <button
            type="button"
            onClick={() => toggleFilmed(projectId, section.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              section.filmed
                ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 border border-transparent'
            }`}
          >
            <Video className="w-3 h-3" />
            <span>Filmed</span>
            {section.filmed && <Check className="w-3 h-3 stroke-[2.5]" />}
          </button>

          {/* Inserted Toggle */}
          <button
            type="button"
            onClick={() => toggleInserted(projectId, section.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              section.inserted
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 border border-transparent'
            }`}
          >
            <Scissors className="w-3 h-3" />
            <span>Inserted</span>
            {section.inserted && <Check className="w-3 h-3 stroke-[2.5]" />}
          </button>

          {/* Reorder and Delete Controls */}
          <div className="flex items-center gap-0.5 ml-1 opacity-60 group-hover:opacity-100 transition">
            <button
              type="button"
              disabled={index === 0}
              onClick={onMoveUp}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 rounded transition"
              title="Move Up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={index === totalSections - 1}
              onClick={onMoveDown}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 rounded transition"
              title="Move Down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => deleteSection(projectId, section.id)}
              className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition"
              title="Delete Section"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Script Text Body */}
      <div className="p-3">
        <textarea
          value={section.content}
          onChange={(e) => updateSection(projectId, section.id, { content: e.target.value })}
          placeholder="Type script or teleprompter lines here..."
          rows={Math.max(2, Math.min(8, section.content.split('\n').length))}
          className="w-full bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-950/40 focus:bg-slate-50 dark:focus:bg-slate-950/70 border border-transparent focus:border-slate-300 dark:focus:border-slate-700/80 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition resize-y font-mono leading-relaxed"
        />
        {wordCount > 0 && (
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono text-right mt-0.5 pr-1">
            {wordCount} words
          </div>
        )}
      </div>
    </div>
  );
};
