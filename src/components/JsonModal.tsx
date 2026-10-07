import React, { useState, useEffect } from 'react';
import { AppArchitecture } from '../types/architecture';
import { INITIAL_ARCHITECTURE } from '../data/initialData';
import {
  X,
  Check,
  Copy,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Download,
  Upload,
} from 'lucide-react';

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  architecture: AppArchitecture;
  onUpdateArchitecture: (newArchitecture: AppArchitecture) => void;
}

export const JsonModal: React.FC<JsonModalProps> = ({
  isOpen,
  onClose,
  architecture,
  onUpdateArchitecture,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setJsonText(JSON.stringify(architecture, null, 2));
      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, architecture]);

  if (!isOpen) return null;

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err: unknown) {
      setError(`Cannot format: ${err instanceof Error ? err.message : 'Invalid JSON'}`);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setError('Could not write to clipboard automatically.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screen_architecture.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetToDefault = () => {
    setJsonText(JSON.stringify(INITIAL_ARCHITECTURE, null, 2));
    setError(null);
    setSuccessMessage('Loaded default architecture preset.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);

      // Validation
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Root object must be a valid JSON object.');
      }

      if (!Array.isArray(parsed.screens)) {
        throw new Error('Schema error: "screens" must be an array.');
      }

      if (!Array.isArray(parsed.transitions)) {
        throw new Error('Schema error: "transitions" must be an array.');
      }

      if (!Array.isArray(parsed.journeys)) {
        throw new Error('Schema error: "journeys" must be an array.');
      }

      // Validate screens items
      for (let i = 0; i < parsed.screens.length; i++) {
        const s = parsed.screens[i];
        if (!s.id || typeof s.id !== 'string') {
          throw new Error(`Screen item [${i}] is missing a valid string "id".`);
        }
        if (!s.name || typeof s.name !== 'string') {
          throw new Error(`Screen [${s.id}] is missing a valid string "name".`);
        }
      }

      // Validate transitions items
      for (let i = 0; i < parsed.transitions.length; i++) {
        const t = parsed.transitions[i];
        if (!t.id || typeof t.id !== 'string') {
          throw new Error(`Transition item [${i}] is missing a valid string "id".`);
        }
        if (!t.from || typeof t.from !== 'string') {
          throw new Error(`Transition [${t.id}] is missing a valid string "from".`);
        }
        if (!t.to || typeof t.to !== 'string') {
          throw new Error(`Transition [${t.id}] is missing a valid string "to".`);
        }
      }

      // Validate journeys
      for (let i = 0; i < parsed.journeys.length; i++) {
        const j = parsed.journeys[i];
        if (!j.id || typeof j.id !== 'string') {
          throw new Error(`Journey item [${i}] is missing a valid string "id".`);
        }
        if (!Array.isArray(j.pathScreenIds)) {
          throw new Error(`Journey [${j.id}] must have "pathScreenIds" array.`);
        }
        if (!Array.isArray(j.pathTransitionIds)) {
          throw new Error(`Journey [${j.id}] must have "pathTransitionIds" array.`);
        }
      }

      // Save and close
      onUpdateArchitecture(parsed);
      setError(null);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown validation error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Architecture Schema & JSON Editor
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit the live architecture model or paste your custom screen flow dataset.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-2.5 border-b border-slate-800 bg-slate-950/70 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleFormat}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors flex items-center gap-1.5"
            >
              Format JSON
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>

          <button
            onClick={handleResetToDefault}
            className="px-3 py-1.5 rounded-md text-slate-400 hover:text-amber-400 hover:bg-amber-950/30 transition-colors flex items-center gap-1.5 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default Preset
          </button>
        </div>

        {/* Status / Error Banner */}
        {error && (
          <div className="mx-6 mt-3 p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="font-mono">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-3 p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60 flex items-center gap-2 text-xs text-emerald-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Text Area */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              if (error) setError(null);
            }}
            spellCheck={false}
            className="w-full flex-1 bg-slate-950 text-slate-200 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 resize-none leading-relaxed"
            placeholder="Paste your JSON architecture here..."
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/40">
          <div className="text-xs text-slate-400">
            Clicking <strong className="text-slate-200">Update Graph</strong> validates the schema and re-runs the DAG layout engine.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors"
            >
              Update Graph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
