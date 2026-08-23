import React, { useEffect } from 'react';
import { useTheme, FONT_OPTIONS, FontFamily } from '../../context/ThemeContext';
import {
  X,
  Check,
  Type,
  Sparkles,
  Video,
  Scissors,
} from 'lucide-react';

interface FontComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FontComparisonModal: React.FC<FontComparisonModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { font: currentFont, setFont } = useTheme();

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Type className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Choose Typography Style
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Each card below is rendered directly in its own typeface for comparison (Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">ESC</kbd> to close)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Font Cards Grid */}
        <div className="flex-1 overflow-y-auto py-5 pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FONT_OPTIONS.map((f) => {
              const isSelected = f.id === currentFont;

              return (
                <div
                  key={f.id}
                  data-font-card={f.id}
                  className={`relative p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-slate-800/95 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md'
                      : 'bg-slate-50/60 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Genre & Active Status */}
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 truncate">
                        {f.genre}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/30 shrink-0">
                          Active
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                      {f.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                      {f.tagline}
                    </p>

                    {/* Live Tracker Sample Component */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-2 text-left shadow-sm">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-slate-100 truncate text-xs">
                          10 Secrets to Viral Retention
                        </span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                          75%
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                        &quot;Hook: 80% of viewers drop in the first 5s. Fix your A-roll cadence.&quot;
                      </p>

                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center gap-1 border border-sky-500/20">
                          <Video className="w-2.5 h-2.5" />
                          Filmed
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 border border-emerald-500/20">
                          <Scissors className="w-2.5 h-2.5" />
                          Inserted
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                      {f.description}
                    </p>
                  </div>

                  {/* Apply Button */}
                  <button
                    type="button"
                    onClick={() => setFont(f.id)}
                    className={`w-full mt-4 py-2 px-3 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Active Theme Font</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Apply {f.name}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Click any style to apply it across all headers, script editors, and buttons.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            Done (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};
