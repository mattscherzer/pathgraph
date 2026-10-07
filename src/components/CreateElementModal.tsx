import React, { useState } from 'react';
import { AppArchitecture } from '../types/architecture';
import { X, Plus, Layers, ArrowRight, Route } from 'lucide-react';

interface CreateElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  architecture: AppArchitecture;
  onAddScreen: (screen: { id: string; name: string; group: string; description: string }) => void;
  onAddTransition: (transition: { id: string; from: string; to: string; label: string }) => void;
}

export const CreateElementModal: React.FC<CreateElementModalProps> = ({
  isOpen,
  onClose,
  architecture,
  onAddScreen,
  onAddTransition,
}) => {
  const [activeTab, setActiveTab] = useState<'screen' | 'transition'>('screen');

  // Screen form state
  const [screenName, setScreenName] = useState('');
  const [screenId, setScreenId] = useState('');
  const [screenGroup, setScreenGroup] = useState('Core');
  const [screenDescription, setScreenDescription] = useState('');

  // Transition form state
  const [fromScreen, setFromScreen] = useState(architecture.screens[0]?.id || '');
  const [toScreen, setToScreen] = useState(architecture.screens[1]?.id || '');
  const [transitionLabel, setTransitionLabel] = useState('');
  const [transitionId, setTransitionId] = useState('');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateScreen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenName.trim()) {
      setError('Screen name is required.');
      return;
    }
    const finalId = screenId.trim() || `scr_${screenName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    if (architecture.screens.some((s) => s.id === finalId)) {
      setError(`Screen ID "${finalId}" already exists. Please choose a unique ID.`);
      return;
    }

    onAddScreen({
      id: finalId,
      name: screenName.trim(),
      group: screenGroup.trim() || 'General',
      description: screenDescription.trim(),
    });
    onClose();
  };

  const handleCreateTransition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromScreen || !toScreen) {
      setError('Both source and target screens are required.');
      return;
    }
    if (!transitionLabel.trim()) {
      setError('Transition action label is required.');
      return;
    }
    const finalId = transitionId.trim() || `tr_${Date.now().toString().slice(-4)}`;
    if (architecture.transitions.some((t) => t.id === finalId)) {
      setError(`Transition ID "${finalId}" already exists.`);
      return;
    }

    onAddTransition({
      id: finalId,
      from: fromScreen,
      to: toScreen,
      label: transitionLabel.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-slate-100">Add Architecture Element</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950/40">
          <button
            type="button"
            onClick={() => {
              setActiveTab('screen');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'screen'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            New Screen Node
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('transition');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'transition'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            New Action / Transition
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Screen Form */}
        {activeTab === 'screen' && (
          <form onSubmit={handleCreateScreen} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Screen Title *
              </label>
              <input
                type="text"
                required
                value={screenName}
                onChange={(e) => {
                  setScreenName(e.target.value);
                  if (!screenId) {
                    setScreenId(`scr_${e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_')}`);
                  }
                }}
                placeholder="e.g. Profile Security Modal"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Unique ID
                </label>
                <input
                  type="text"
                  value={screenId}
                  onChange={(e) => setScreenId(e.target.value)}
                  placeholder="scr_profile_sec"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Feature Group
                </label>
                <input
                  type="text"
                  value={screenGroup}
                  onChange={(e) => setScreenGroup(e.target.value)}
                  placeholder="Auth, Core, Monetization..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Description / Purpose
              </label>
              <textarea
                value={screenDescription}
                onChange={(e) => setScreenDescription(e.target.value)}
                rows={3}
                placeholder="Briefly state screen responsibilities and interactive affordances..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Create Screen
              </button>
            </div>
          </form>
        )}

        {/* Transition Form */}
        {activeTab === 'transition' && (
          <form onSubmit={handleCreateTransition} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  From Screen *
                </label>
                <select
                  value={fromScreen}
                  onChange={(e) => setFromScreen(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {architecture.screens.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  To Screen *
                </label>
                <select
                  value={toScreen}
                  onChange={(e) => setToScreen(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {architecture.screens.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Action Label *
              </label>
              <input
                type="text"
                required
                value={transitionLabel}
                onChange={(e) => setTransitionLabel(e.target.value)}
                placeholder="e.g. Tap Verify Email"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Transition ID (Optional)
              </label>
              <input
                type="text"
                value={transitionId}
                onChange={(e) => setTransitionId(e.target.value)}
                placeholder="tr_99"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Create Transition
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
