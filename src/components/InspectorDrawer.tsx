import React from 'react';
import {
  ScreenNodeData,
  TransitionEdgeData,
  UserJourney,
  AppArchitecture,
} from '../types/architecture';
import { getGroupStyle } from '../utils/theme';
import {
  X,
  ArrowRight,
  Layers,
  Compass,
  CornerDownRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface InspectorDrawerProps {
  selectedElement:
    | { type: 'screen'; data: ScreenNodeData }
    | { type: 'transition'; data: TransitionEdgeData }
    | null;
  architecture: AppArchitecture;
  onClose: () => void;
  onSelectScreenById: (id: string) => void;
  onSelectTransitionById: (id: string) => void;
}

export const InspectorDrawer: React.FC<InspectorDrawerProps> = ({
  selectedElement,
  architecture,
  onClose,
  onSelectScreenById,
  onSelectTransitionById,
}) => {
  if (!selectedElement) {
    // Render architecture overview metrics
    const groupCounts = architecture.screens.reduce<Record<string, number>>(
      (acc, scr) => {
        acc[scr.group] = (acc[scr.group] || 0) + 1;
        return acc;
      },
      {}
    );

    return (
      <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 text-slate-200 w-80 lg:w-96 p-5 overflow-y-auto select-none">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Architecture Overview
            </span>
            <h3 className="text-base font-bold text-slate-100">Flow Blueprint</h3>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        {/* High-level stats */}
        <div className="grid grid-cols-3 gap-2.5 my-5">
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 text-center">
            <span className="block text-xl font-bold font-mono text-indigo-400">
              {architecture.screens.length}
            </span>
            <span className="text-[11px] text-slate-400">Screens</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 text-center">
            <span className="block text-xl font-bold font-mono text-cyan-400">
              {architecture.transitions.length}
            </span>
            <span className="text-[11px] text-slate-400">Transitions</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 text-center">
            <span className="block text-xl font-bold font-mono text-emerald-400">
              {architecture.journeys.length}
            </span>
            <span className="text-[11px] text-slate-400">Journeys</span>
          </div>
        </div>

        {/* Feature Groups Breakdown */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Feature Domains ({Object.keys(groupCounts).length})
          </h4>
          <div className="space-y-1.5">
            {Object.entries(groupCounts).map(([group, count]) => {
              const style = getGroupStyle(group);
              return (
                <div
                  key={group}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950/50 border border-slate-800/60"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <span className="text-xs font-medium text-slate-200">
                      {group}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {count} {count === 1 ? 'screen' : 'screens'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Guide Tip */}
        <div className="mt-auto p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-300 leading-relaxed">
          <p className="font-medium text-indigo-200 mb-1">Interactive Inspector</p>
          Click any screen card or transition edge on the canvas to inspect its full routing, connected states, and journey memberships.
        </div>
      </div>
    );
  }

  if (selectedElement.type === 'screen') {
    const screen = selectedElement.data;
    const groupStyle = getGroupStyle(screen.group);

    // Incoming transitions
    const incoming = architecture.transitions.filter((t) => t.to === screen.id);
    // Outgoing transitions
    const outgoing = architecture.transitions.filter((t) => t.from === screen.id);

    // Journeys containing this screen
    const relatedJourneys = architecture.journeys.filter((j) =>
      j.pathScreenIds.includes(screen.id)
    );

    return (
      <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 text-slate-200 w-80 lg:w-96 p-5 overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${groupStyle.badgeBg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${groupStyle.dot}`} />
                {screen.group}
              </span>
              <span className="font-mono text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {screen.id}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">
              {screen.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Close Inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <div className="my-4 p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block mb-1">
            Description
          </span>
          <p className="text-xs leading-relaxed text-slate-300">
            {screen.description || 'No description provided.'}
          </p>
        </div>

        {/* Connected Journeys */}
        <div className="mb-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              Active in Journeys ({relatedJourneys.length})
            </span>
          </div>
          {relatedJourneys.length === 0 ? (
            <p className="text-xs text-slate-500 italic px-1">
              Not part of any defined journeys.
            </p>
          ) : (
            <div className="space-y-1.5">
              {relatedJourneys.map((j) => {
                const stepIdx = j.pathScreenIds.indexOf(screen.id) + 1;
                return (
                  <div
                    key={j.id}
                    className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-900/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-medium text-indigo-300 block">
                        {j.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Step {stepIdx} of {j.pathScreenIds.length}
                      </span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Incoming Transitions */}
        <div className="mb-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CornerDownRight className="w-3.5 h-3.5 text-cyan-400 rotate-90" />
            Incoming Transitions ({incoming.length})
          </span>
          {incoming.length === 0 ? (
            <p className="text-xs text-slate-500 italic px-1">
              Initial entry point (no inbound transitions).
            </p>
          ) : (
            <div className="space-y-1.5">
              {incoming.map((t) => {
                const fromScreen = architecture.screens.find(
                  (s) => s.id === t.from
                );
                return (
                  <button
                    key={t.id}
                    onClick={() => onSelectTransitionById(t.id)}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-950 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-300">
                        {t.label}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {t.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span>From:</span>
                      <span className="text-slate-200 font-medium truncate">
                        {fromScreen ? fromScreen.name : t.from}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Outgoing Transitions */}
        <div className="mb-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            Outgoing Transitions ({outgoing.length})
          </span>
          {outgoing.length === 0 ? (
            <p className="text-xs text-slate-500 italic px-1">
              Terminal screen (no outbound transitions).
            </p>
          ) : (
            <div className="space-y-1.5">
              {outgoing.map((t) => {
                const toScreen = architecture.screens.find(
                  (s) => s.id === t.to
                );
                return (
                  <button
                    key={t.id}
                    onClick={() => onSelectTransitionById(t.id)}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-950 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-300">
                        {t.label}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {t.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span>To:</span>
                      <span className="text-slate-200 font-medium truncate">
                        {toScreen ? toScreen.name : t.to}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Selected Transition
  const transition = selectedElement.data;
  const fromScreen = architecture.screens.find((s) => s.id === transition.from);
  const toScreen = architecture.screens.find((s) => s.id === transition.to);
  const relatedJourneys = architecture.journeys.filter((j) =>
    j.pathTransitionIds.includes(transition.id)
  );

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 text-slate-200 w-80 lg:w-96 p-5 overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
              User Action / Transition
            </span>
            <span className="font-mono text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {transition.id}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 tracking-tight">
            "{transition.label}"
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Close Inspector"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Origin & Destination */}
      <div className="my-5 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Path Traversal
        </span>

        {/* Source Screen */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">
            Source Screen
          </span>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-slate-100">
              {fromScreen?.name || transition.from}
            </span>
            {fromScreen && (
              <button
                onClick={() => onSelectScreenById(fromScreen.id)}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline"
              >
                Inspect
              </button>
            )}
          </div>
          <span className="font-mono text-[10px] text-slate-500 mt-1 block">
            ID: {transition.from}
          </span>
        </div>

        {/* Action Vector Indicator */}
        <div className="flex items-center justify-center text-slate-500 py-0.5">
          <ArrowRight className="w-5 h-5 text-indigo-400" />
        </div>

        {/* Target Screen */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">
            Target Destination
          </span>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-slate-100">
              {toScreen?.name || transition.to}
            </span>
            {toScreen && (
              <button
                onClick={() => onSelectScreenById(toScreen.id)}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline"
              >
                Inspect
              </button>
            )}
          </div>
          <span className="font-mono text-[10px] text-slate-500 mt-1 block">
            ID: {transition.to}
          </span>
        </div>
      </div>

      {/* Journeys utilizing this transition */}
      <div className="mb-5 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          Active in Journeys ({relatedJourneys.length})
        </span>
        {relatedJourneys.length === 0 ? (
          <p className="text-xs text-slate-500 italic px-1">
            This transition is not bound to any defined journeys.
          </p>
        ) : (
          <div className="space-y-1.5">
            {relatedJourneys.map((j) => (
              <div
                key={j.id}
                className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-900/30 flex items-center justify-between text-xs"
              >
                <span className="font-medium text-indigo-300">{j.name}</span>
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
