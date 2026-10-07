import React, { memo } from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';

export interface TransitionEdgeCustomData {
  id: string;
  label: string;
  from: string;
  to: string;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  isSelected?: boolean;
  stepNumber?: number | null;
  onSelectTransition?: (data: { id: string; label: string; from: string; to: string }) => void;
}

export const TransitionEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps) => {
  const edgeData = data as unknown as TransitionEdgeCustomData;
  const {
    label = '',
    from = '',
    to = '',
    isHighlighted = false,
    isDimmed = false,
    isSelected = false,
    stepNumber = null,
    onSelectTransition,
  } = edgeData || {};

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.25,
  });

  const handleLabelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectTransition) {
      onSelectTransition({ id, label, from, to });
    }
  };

  // Edge styling
  let strokeColor = '#475569'; // slate-600
  let strokeWidth = 1.75;
  let strokeDasharray = undefined;
  let animationClass = '';

  if (isDimmed) {
    strokeColor = '#334155'; // slate-700
    strokeWidth = 1.2;
  } else if (isHighlighted) {
    strokeColor = '#818cf8'; // indigo-400
    strokeWidth = 3;
    strokeDasharray = '6 4';
    animationClass = 'animate-dash';
  } else if (isSelected) {
    strokeColor = '#e2e8f0'; // slate-200
    strokeWidth = 2.5;
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray,
          opacity: isDimmed ? 0.22 : 1,
          transition: 'all 0.25s ease',
        }}
        className={animationClass}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className={`nodrag nopan transition-all duration-200 z-10 ${
            isDimmed ? 'opacity-25 grayscale' : 'opacity-100'
          }`}
        >
          <button
            type="button"
            onClick={handleLabelClick}
            className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium tracking-tight shadow-sm transition-all cursor-pointer whitespace-nowrap ${
              isHighlighted
                ? 'bg-slate-900 text-indigo-300 border border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.35)] ring-1 ring-indigo-500/40 hover:bg-slate-850'
                : isSelected
                ? 'bg-slate-100 text-slate-900 border border-white font-semibold ring-2 ring-slate-400/40'
                : 'bg-slate-900/90 text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white hover:bg-slate-800'
            }`}
          >
            {stepNumber !== null && (
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-[10px] text-white flex items-center justify-center font-bold">
                {stepNumber}
              </span>
            )}
            <span className="truncate max-w-[140px]">{label || 'Transition'}</span>
            <span className="text-slate-500 group-hover:text-slate-400 text-[10px]">
              →
            </span>
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

TransitionEdge.displayName = 'TransitionEdge';
