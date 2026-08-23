import React, { useState, useRef } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { backupService } from '../../services/backupService';
import { ValidationResult } from '../../types';
import {
  Download,
  Upload,
  X,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  Replace,
  Sparkles,
} from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { projects, importProjects, resetToDefaults, showToast } = useProjects();
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    backupService.exportData(projects);
    showToast('success', 'Backup Exported', `Saved ${projects.length} projects to JSON file.`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = backupService.validateImportData(content);
      setValidationResult(result);
    };
    reader.onerror = () => {
      setValidationResult({
        isValid: false,
        projects: [],
        errors: ['Failed to read the selected file.'],
        warnings: [],
      });
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!validationResult || !validationResult.isValid || validationResult.projects.length === 0) {
      return;
    }
    importProjects(validationResult.projects, importMode);
    onClose();
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset workspace to demo sample projects? Any unsaved custom projects will be replaced.')) {
      resetToDefaults();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <FileJson className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Backup & Restore</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Export or import your complete video production database</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {/* Export Section */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                Export All Projects
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Save all {projects.length} projects, script sections, and publishing states to a single `.json` file.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Import Section */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                Import JSON Backup
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Load a previously exported JSON backup file.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />

            {!validationResult ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 px-3 border border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 rounded-xl bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex flex-col items-center justify-center gap-1 text-center cursor-pointer"
              >
                <Upload className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Click to Select Backup JSON File</span>
              </button>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-mono truncate pr-2 text-slate-700 dark:text-slate-300">{fileName}</span>
                  <button
                    onClick={() => {
                      setValidationResult(null);
                      setFileName(null);
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800"
                  >
                    Change
                  </button>
                </div>

                {validationResult.isValid ? (
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Valid file! Found {validationResult.projects.length} project(s).</span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setImportMode('replace')}
                        className={`flex-1 py-1 px-2 rounded text-xs font-semibold transition ${
                          importMode === 'replace'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        Replace All
                      </button>
                      <button
                        type="button"
                        onClick={() => setImportMode('merge')}
                        className={`flex-1 py-1 px-2 rounded text-xs font-semibold transition ${
                          importMode === 'merge'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        Merge
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmImport}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
                    >
                      Confirm Restore
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-800 dark:text-rose-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      <span>Invalid JSON Schema</span>
                    </div>
                    {validationResult.errors.map((err, idx) => (
                      <div key={idx} className="text-[11px] pl-5">
                        • {err}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Need sample data?</span>
            <button
              type="button"
              onClick={handleResetDemo}
              className="text-xs text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3 h-3" />
              Reset to Sample Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
