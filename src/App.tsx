/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';
import { AppArchitecture, SelectedElement } from './types/architecture';
import { INITIAL_ARCHITECTURE } from './data/initialData';
import { FlowCanvas } from './components/FlowCanvas';
import { Sidebar } from './components/Sidebar';
import { InspectorDrawer } from './components/InspectorDrawer';
import { TopBar } from './components/TopBar';
import { JsonModal } from './components/JsonModal';
import { CreateElementModal } from './components/CreateElementModal';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

function AppContent() {
  const [architecture, setArchitecture] = useState<AppArchitecture>(INITIAL_ARCHITECTURE);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>('all');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [layoutDirection, setLayoutDirection] = useState<'LR' | 'TB'>('LR');
  const [selectedElement, setSelectedElement] = useState<SelectedElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  // Modals
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const { fitView, getNode } = useReactFlow();

  // Distinct groups
  const availableGroups = useMemo(() => {
    const groups = new Set<string>();
    architecture.screens.forEach((s) => {
      if (s.group) groups.add(s.group);
    });
    return Array.from(groups).sort();
  }, [architecture.screens]);

  // Handle Journey selection
  const handleSelectJourney = useCallback((id: string) => {
    setSelectedJourneyId(id);
    setActiveStepIndex(0);
    // Auto select first screen of the journey for inspection if available
    if (id !== 'all') {
      const journey = architecture.journeys.find((j) => j.id === id);
      if (journey && journey.pathScreenIds.length > 0) {
        const firstScr = architecture.screens.find(
          (s) => s.id === journey.pathScreenIds[0]
        );
        if (firstScr) {
          setSelectedElement({ type: 'screen', data: firstScr });
        }
      }
    } else {
      setSelectedElement(null);
    }
  }, [architecture]);

  // Center on a specific screen node
  const handleFocusScreen = useCallback(
    (screenId: string) => {
      const scr = architecture.screens.find((s) => s.id === screenId);
      if (scr) {
        setSelectedElement({ type: 'screen', data: scr });
      }
      const node = getNode(screenId);
      if (node && node.position) {
        fitView({
          nodes: [{ id: screenId }],
          duration: 600,
          padding: 0.8,
        });
      }
    },
    [architecture.screens, getNode, fitView]
  );

  // Update architecture from JSON editor
  const handleUpdateArchitecture = useCallback((newArchitecture: AppArchitecture) => {
    setArchitecture(newArchitecture);
    // Check if current journey still exists
    if (
      selectedJourneyId !== 'all' &&
      !newArchitecture.journeys.some((j) => j.id === selectedJourneyId)
    ) {
      setSelectedJourneyId('all');
    }
    setSelectedElement(null);
  }, [selectedJourneyId]);

  // Add Screen
  const handleAddScreen = useCallback((newScreen: {
    id: string;
    name: string;
    group: string;
    description: string;
  }) => {
    setArchitecture((prev) => ({
      ...prev,
      screens: [...prev.screens, newScreen],
    }));
    setSelectedElement({ type: 'screen', data: newScreen });
  }, []);

  // Add Transition
  const handleAddTransition = useCallback((newTransition: {
    id: string;
    from: string;
    to: string;
    label: string;
  }) => {
    setArchitecture((prev) => ({
      ...prev,
      transitions: [...prev.transitions, newTransition],
    }));
    setSelectedElement({ type: 'transition', data: newTransition });
  }, []);

  const handleSelectScreenById = useCallback(
    (id: string) => {
      const scr = architecture.screens.find((s) => s.id === id);
      if (scr) {
        setSelectedElement({ type: 'screen', data: scr });
        handleFocusScreen(id);
      }
    },
    [architecture.screens, handleFocusScreen]
  );

  const handleSelectTransitionById = useCallback(
    (id: string) => {
      const tr = architecture.transitions.find((t) => t.id === id);
      if (tr) {
        setSelectedElement({ type: 'transition', data: tr });
      }
    },
    [architecture.transitions]
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Bar */}
      <TopBar
        layoutDirection={layoutDirection}
        onToggleLayout={() =>
          setLayoutDirection((prev) => (prev === 'LR' ? 'TB' : 'LR'))
        }
        onFitView={() => fitView({ padding: 0.2, duration: 400 })}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        selectedGroupFilter={selectedGroupFilter}
        onSelectGroupFilter={setSelectedGroupFilter}
        availableGroups={availableGroups}
      />

      {/* Main Workspace Canvas & Sidebars */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Sidebar: Journey Navigator */}
        <Sidebar
          architecture={architecture}
          selectedJourneyId={selectedJourneyId}
          onSelectJourney={handleSelectJourney}
          activeStepIndex={activeStepIndex}
          onSetStepIndex={setActiveStepIndex}
          onFocusScreen={handleFocusScreen}
        />

        {/* Center: Interactive React Flow Canvas */}
        <main className="flex-1 h-full relative">
          <FlowCanvas
            architecture={architecture}
            selectedJourneyId={selectedJourneyId}
            selectedGroupFilter={selectedGroupFilter}
            layoutDirection={layoutDirection}
            selectedElement={selectedElement}
            onSelectElement={(el) => {
              setSelectedElement(el);
              if (el && !isInspectorOpen) {
                setIsInspectorOpen(true);
              }
            }}
          />

          {/* Toggle Inspector floating button */}
          <button
            onClick={() => setIsInspectorOpen((prev) => !prev)}
            className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 shadow-lg transition-colors cursor-pointer"
            title={isInspectorOpen ? 'Collapse Inspector' : 'Expand Inspector'}
          >
            {isInspectorOpen ? (
              <PanelRightClose className="w-4 h-4" />
            ) : (
              <PanelRightOpen className="w-4 h-4" />
            )}
          </button>
        </main>

        {/* Right Sidebar: Detail Inspector */}
        {isInspectorOpen && (
          <aside className="h-full z-10 shrink-0">
            <InspectorDrawer
              selectedElement={selectedElement}
              architecture={architecture}
              onClose={() => setSelectedElement(null)}
              onSelectScreenById={handleSelectScreenById}
              onSelectTransitionById={handleSelectTransitionById}
            />
          </aside>
        )}
      </div>

      {/* JSON Schema & Raw Data Modal */}
      <JsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        architecture={architecture}
        onUpdateArchitecture={handleUpdateArchitecture}
      />

      {/* Create Screen / Transition Modal */}
      <CreateElementModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        architecture={architecture}
        onAddScreen={handleAddScreen}
        onAddTransition={handleAddTransition}
      />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}
