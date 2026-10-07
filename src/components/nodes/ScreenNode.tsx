import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ScreenNodeData } from '../../types/architecture';
import { getGroupStyle } from '../../utils/theme';

export interface ScreenNodeCustomData extends ScreenNodeData {
  isHighlighted?: boolean;
  isDimmed?: boolean;
  isSelected?: boolean;
  stepNumber?: number | null;
  direction?: 'LR' | 'TB';
  incomingCount?: number;
  outgoingCount?: number;
}

export const ScreenNode = memo(({ data }: NodeProps) => {
  const customData = data as unknown as ScreenNodeCustomData;
  const {
    id,
    name,
    group,
    description,
    isHighlighted,
    isDimmed,
    isSelected,
    stepNumber,
    direction = 'LR',
    incomingCount = 0,
    outgoingCount = 0,
  } = customData;

  const groupStyle = getGroupStyle(group);
  const isHorizontal = direction === 'LR';

  const targetPosition = isHorizontal ? Position.Left : Position.Top;
  const sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

  return (
    <div
      className={`relative w-[280px] rounded-xl transition-all duration-250 cursor-pointer select-none text-left ${
        isDimmed
          ? 'opacity-25 grayscale scale-[0.98]'
          : isHighlighted
          ? 'bg-slate-900/95 border-2 border-indigo-500 shadow-[0_0_24px_rgba(99,102,241,0.4)] ring-2 ring-indigo-500/30 scale-[1.02]'
          : isSelected
          ? 'bg-slate-900/95 border-2 border-slate-200 ring-2 ring-slate-400/20 shadow-lg'
          : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 shadow-md'
      }`}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={targetPosition}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-slate-900 hover:!bg-indigo-400 transition-colors"
      />
      <Handle
        type="source"
        position={sourcePosition}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-slate-900 hover:!bg-indigo-400 transition-colors"
      />

      {/* Step Sequence Badge (if in active journey) */}
      {stepNumber !== null && stepNumber !== undefined && (
        <div className="absolute -top-3.5 -left-2 z-20 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-semibold tracking-wide shadow-md border border-indigo-400">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Step {stepNumber}
        </div>
      )}

      {/* Selected Indicator Pill */}
      {isSelected && !stepNumber && (
        <div className="absolute -top-3 -right-2 z-20 px-2 py-0.5 rounded-full bg-slate-200 text-slate-950 text-[10px] font-bold tracking-wider uppercase shadow">
          Inspecting
        </div>
      )}

      <div className="p-3.5 space-y-2.5">
        {/* Header: Group tag + Screen ID */}
        <div className="flex items-center justify-between gap-2">
          {/* Feature Group Tag */}
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${groupStyle.badgeBg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${groupStyle.dot}`} />
            <span className="truncate max-w-[110px]">{group}</span>
          </div>

          {/* Screen ID badge */}
          <span className="font-mono text-[10px] text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800/80 truncate">
            {id}
          </span>
        </div>

        {/* Screen Name */}
        <div>
          <h4
            className={`text-sm font-semibold tracking-tight transition-colors line-clamp-1 ${
              isHighlighted ? 'text-indigo-200 font-bold' : 'text-slate-100'
            }`}
          >
            {name}
          </h4>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Footer info: Connections */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span>In: {incomingCount}</span>
            <span>·</span>
            <span>Out: {outgoingCount}</span>
          </div>
          {isHighlighted && (
            <span className="text-indigo-400 font-medium">In Journey</span>
          )}
        </div>
      </div>
    </div>
  );
});

ScreenNode.displayName = 'ScreenNode';
