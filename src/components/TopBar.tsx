import React from 'react';
import {
  Code,
  Plus,
  RotateCcw,
  Maximize2,
  SlidersHorizontal,
  LayoutGrid,
} from 'lucide-react';

interface TopBarProps {
  layoutDirection: 'LR' | 'TB';
  onToggleLayout: () => void;
  onFitView: () => void;
  onOpenJsonModal: () => void;
  onOpenCreateModal: () => void;
  selectedGroupFilter: string; // 'all' or specific group
  onSelectGroupFilter: (group: string) => void;
  availableGroups: string[];
}

export const TopBar: React.FC<TopBarProps> = ({
  layoutDirection,
  onToggleLayout,
  onFitView,
  onOpenJsonModal,
  onOpenCreateModal,
  selectedGroupFilter,
  onSelectGroupFilter,
  availableGroups,
}) => {
  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-5 flex items-center justify-between shrink-0 z-30 select-none">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <span className="text-base font-bold tracking-tight text-slate-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
          AppArch Studio
        </span>
      </div>

      {/* Zone 2: 4-6 clean text controls */}
      <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-300">
        {/* Layout direction toggle */}
        <button
          onClick={onToggleLayout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors cursor-pointer"
          title={`Switch layout to ${layoutDirection === 'LR' ? 'Top-to-Bottom' : 'Left-to-Right'}`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          <span>DAG: {layoutDirection === 'LR' ? 'Horizontal (LR)' : 'Vertical (TB)'}</span>
        </button>

        {/* Group Filter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800">
          <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Filter:</span>
          <select
            value={selectedGroupFilter}
            onChange={(e) => onSelectGroupFilter(e.target.value)}
            className="bg-transparent text-slate-200 border-none outline-none text-xs cursor-pointer focus:ring-0"
          >
            <option value="all" className="bg-slate-900 text-slate-200">
              All Feature Groups
            </option>
            {availableGroups.map((g) => (
              <option key={g} value={g} className="bg-slate-900 text-slate-200">
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Fit View button */}
        <button
          onClick={onFitView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Center Graph</span>
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenJsonModal}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Code className="w-3.5 h-3.5 text-indigo-400" />
          <span>JSON Schema</span>
        </button>

        <button
          onClick={onOpenCreateModal}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Element</span>
        </button>
      </div>
    </header>
  );
};
