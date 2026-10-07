import React, { useMemo, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  Node,
  Edge,
  NodeMouseHandler,
  EdgeMouseHandler,
  Panel,
} from '@xyflow/react';
import { ScreenNode } from './nodes/ScreenNode';
import { TransitionEdge } from './edges/TransitionEdge';
import {
  AppArchitecture,
  SelectedElement,
  ScreenNodeData,
  TransitionEdgeData,
} from '../types/architecture';
import { getLayoutedElements } from '../utils/layout';
import { Maximize2, Compass } from 'lucide-react';

interface FlowCanvasProps {
  architecture: AppArchitecture;
  selectedJourneyId: string;
  selectedGroupFilter: string;
  layoutDirection: 'LR' | 'TB';
  selectedElement: SelectedElement;
  onSelectElement: (el: SelectedElement) => void;
  flowInstanceRef?: React.MutableRefObject<(() => void) | null>;
}

const nodeTypes = {
  screenNode: ScreenNode,
};

const edgeTypes = {
  transitionEdge: TransitionEdge,
};

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  architecture,
  selectedJourneyId,
  selectedGroupFilter,
  layoutDirection,
  selectedElement,
  onSelectElement,
}) => {
  const { fitView, setCenter } = useReactFlow();

  const currentJourney = useMemo(() => {
    return selectedJourneyId === 'all'
      ? null
      : architecture.journeys.find((j) => j.id === selectedJourneyId) || null;
  }, [selectedJourneyId, architecture.journeys]);

  // Construct raw nodes and edges with computed highlight/dimmed states
  const { rawNodes, rawEdges } = useMemo(() => {
    // Count incoming and outgoing transitions
    const incomingMap = new Map<string, number>();
    const outgoingMap = new Map<string, number>();

    architecture.transitions.forEach((t) => {
      outgoingMap.set(t.from, (outgoingMap.get(t.from) || 0) + 1);
      incomingMap.set(t.to, (incomingMap.get(t.to) || 0) + 1);
    });

    const nodes: Node[] = architecture.screens.map((scr) => {
      let isHighlighted = false;
      let isDimmed = false;
      let stepNumber: number | null = null;

      if (currentJourney) {
        const idx = currentJourney.pathScreenIds.indexOf(scr.id);
        if (idx !== -1) {
          isHighlighted = true;
          stepNumber = idx + 1;
        } else {
          isDimmed = true;
        }
      }

      if (selectedGroupFilter !== 'all' && scr.group !== selectedGroupFilter) {
        isDimmed = true;
        isHighlighted = false;
      }

      const isSelected =
        selectedElement?.type === 'screen' && selectedElement.data.id === scr.id;

      return {
        id: scr.id,
        type: 'screenNode',
        position: { x: 0, y: 0 },
        data: {
          ...scr,
          isHighlighted,
          isDimmed,
          isSelected,
          stepNumber,
          direction: layoutDirection,
          incomingCount: incomingMap.get(scr.id) || 0,
          outgoingCount: outgoingMap.get(scr.id) || 0,
        },
      };
    });

    const edges: Edge[] = architecture.transitions.map((t) => {
      let isHighlighted = false;
      let isDimmed = false;
      let stepNumber: number | null = null;

      if (currentJourney) {
        const idx = currentJourney.pathTransitionIds.indexOf(t.id);
        if (idx !== -1) {
          isHighlighted = true;
          stepNumber = idx + 1;
        } else {
          isDimmed = true;
        }
      }

      // If either end is dimmed by group filter
      if (selectedGroupFilter !== 'all') {
        const sourceScr = architecture.screens.find((s) => s.id === t.from);
        const targetScr = architecture.screens.find((s) => s.id === t.to);
        if (
          sourceScr?.group !== selectedGroupFilter &&
          targetScr?.group !== selectedGroupFilter
        ) {
          isDimmed = true;
          isHighlighted = false;
        }
      }

      const isSelected =
        selectedElement?.type === 'transition' &&
        selectedElement.data.id === t.id;

      return {
        id: t.id,
        source: t.from,
        target: t.to,
        type: 'transitionEdge',
        zIndex: isHighlighted ? 20 : isSelected ? 15 : 1,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isHighlighted ? '#818cf8' : isDimmed ? '#334155' : '#64748b',
          width: 14,
          height: 14,
        },
        data: {
          ...t,
          isHighlighted,
          isDimmed,
          isSelected,
          stepNumber,
          onSelectTransition: (data: TransitionEdgeData) => {
            onSelectElement({ type: 'transition', data });
          },
        },
      };
    });

    return { rawNodes: nodes, rawEdges: edges };
  }, [
    architecture,
    currentJourney,
    selectedGroupFilter,
    selectedElement,
    layoutDirection,
    onSelectElement,
  ]);

  // Layout with dagre
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(rawNodes, rawEdges, layoutDirection);
  }, [rawNodes, rawEdges, layoutDirection]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // Sync state whenever layout elements change
  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  // Auto fit view on journey change or layout toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.2, duration: 400 });
    }, 50);
    return () => clearTimeout(timer);
  }, [selectedJourneyId, layoutDirection, fitView]);

  // Handle node click
  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      const screen = architecture.screens.find((s) => s.id === node.id);
      if (screen) {
        onSelectElement({ type: 'screen', data: screen });
      }
    },
    [architecture.screens, onSelectElement]
  );

  // Handle edge click
  const onEdgeClick: EdgeMouseHandler = useCallback(
    (_, edge) => {
      const transition = architecture.transitions.find((t) => t.id === edge.id);
      if (transition) {
        onSelectElement({ type: 'transition', data: transition });
      }
    },
    [architecture.transitions, onSelectElement]
  );

  // Handle background click (clear inspector selection)
  const onPaneClick = useCallback(() => {
    onSelectElement(null);
  }, [onSelectElement]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.8}
        defaultEdgeOptions={{ type: 'transitionEdge' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#1e293b"
        />

        {/* Canvas Controls */}
        <Controls
          showInteractive={false}
          className="!bottom-5 !left-5"
        />

        {/* MiniMap */}
        <MiniMap
          nodeStrokeWidth={2}
          pannable
          zoomable
          className="!bottom-5 !right-5 !hidden md:!block"
        />

        {/* Active Journey Banner Panel */}
        {currentJourney && (
          <Panel position="top-left" className="m-4">
            <div className="bg-slate-900/90 backdrop-blur-md border border-indigo-500/50 rounded-xl p-3 shadow-xl max-w-md pointer-events-auto">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
                <Compass className="w-4 h-4 animate-spin-slow" />
                <span>Spotlight: {currentJourney.name}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {currentJourney.description}
              </p>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span>{currentJourney.pathScreenIds.length} screens highlighted</span>
                <span>·</span>
                <span>{currentJourney.pathTransitionIds.length} transitions animated</span>
              </div>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};
