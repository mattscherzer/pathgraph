import React from 'react';
import { UserJourney, AppArchitecture } from '../types/architecture';
import {
  Compass,
  Layers,
  ChevronRight,
  ChevronLeft,
  Route,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';

interface SidebarProps {
  architecture: AppArchitecture;
  selectedJourneyId: string; // 'all' or journey id
  onSelectJourney: (id: string) => void;
  activeStepIndex: number;
  onSetStepIndex: (index: number) => void;
  onFocusScreen: (screenId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  architecture,
  selectedJourneyId,
  onSelectJourney,
  activeStepIndex,
  onSetStepIndex,
  onFocusScreen,
}) => {
  const { journeys, screens } = architecture;

  const currentJourney = journeys.find((j) => j.id === selectedJourneyId);

  // Helper to get screen object by id
  const getScreen = (id: string) => screens.find((s) => s.id === id);

  return (
    <aside className="h-full flex flex-col bg-slate-900 border-r border-slate-800 text-slate-200 w-80 lg:w-88 shrink-0 select-none">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Journey Navigator
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Select a user path to spotlight route transitions and screen sequences.
        </p>
      </div>

      {/* Journeys List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {/* "All Screens" Option */}
        <button
          type="button"
          onClick={() => onSelectJourney('all')}
          className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
            selectedJourneyId === 'all'
              ? 'bg-indigo-600/15 border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.2)] text-white'
              : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-950/70 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                  selectedJourneyId === 'all'
                    ? 'border-indigo-400 bg-indigo-500'
                    : 'border-slate-600 bg-transparent'
                }`}
              >
                {selectedJourneyId === 'all' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span className="font-semibold text-sm">All Screens (Overview)</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {screens.length} total
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-400 pl-6 leading-relaxed">
            Full architecture map showing every node and transition in standard fidelity.
          </p>
        </button>

        <div className="pt-2 pb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Defined User Journeys ({journeys.length})
          </span>
        </div>

        {/* User Journeys */}
        {journeys.map((journey) => {
          const isSelected = selectedJourneyId === journey.id;
          return (
            <button
              key={journey.id}
              type="button"
              onClick={() => onSelectJourney(journey.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600/15 border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.25)] text-white'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-950/70 text-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`mt-0.5 w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-500'
                        : 'border-slate-600 bg-transparent'
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="font-semibold text-sm">{journey.name}</span>
                </div>
              </div>

              <p className="mt-1.5 text-xs text-slate-400 pl-6 leading-relaxed">
                {journey.description}
              </p>

              {/* Path metadata */}
              <div className="mt-2.5 pl-6 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>{journey.pathScreenIds.length} screens</span>
                <span aria-hidden="true">·</span>
                <span>{journey.pathTransitionIds.length} steps</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Step Walkthrough (When a journey is selected) */}
      {currentJourney && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Path Walkthrough
            </span>
            <span className="text-xs font-mono text-slate-400">
              Step {activeStepIndex + 1} of {currentJourney.pathScreenIds.length}
            </span>
          </div>

          {/* Stepper controls */}
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              disabled={activeStepIndex <= 0}
              onClick={() => {
                const nextIdx = Math.max(0, activeStepIndex - 1);
                onSetStepIndex(nextIdx);
                onFocusScreen(currentJourney.pathScreenIds[nextIdx]);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>

            <div className="flex-1 overflow-x-auto flex items-center gap-1 py-1 justify-center">
              {currentJourney.pathScreenIds.map((screenId, idx) => {
                const isActive = idx === activeStepIndex;
                return (
                  <button
                    key={`${screenId}-${idx}`}
                    type="button"
                    onClick={() => {
                      onSetStepIndex(idx);
                      onFocusScreen(screenId);
                    }}
                    className={`w-6 h-6 rounded-md font-mono text-xs flex items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold shadow ring-1 ring-indigo-400'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    }`}
                    title={`Go to step ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={
                activeStepIndex >= currentJourney.pathScreenIds.length - 1
              }
              onClick={() => {
                const nextIdx = Math.min(
                  currentJourney.pathScreenIds.length - 1,
                  activeStepIndex + 1
                );
                onSetStepIndex(nextIdx);
                onFocusScreen(currentJourney.pathScreenIds[nextIdx]);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Current Step Screen preview */}
          {(() => {
            const currentScreenId = currentJourney.pathScreenIds[activeStepIndex];
            const scr = getScreen(currentScreenId);
            return scr ? (
              <div
                onClick={() => onFocusScreen(scr.id)}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 truncate">
                    {scr.name}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {scr.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                  {scr.description}
                </p>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </aside>
  );
};
