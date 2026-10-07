export interface ScreenNodeData {
  id: string;
  name: string;
  group: string;
  description: string;
}

export interface TransitionEdgeData {
  id: string;
  from: string;
  to: string;
  label: string;
}

export interface UserJourney {
  id: string;
  name: string;
  description: string;
  pathScreenIds: string[];
  pathTransitionIds: string[];
}

export interface AppArchitecture {
  screens: ScreenNodeData[];
  transitions: TransitionEdgeData[];
  journeys: UserJourney[];
}

export type SelectedElement =
  | { type: 'screen'; data: ScreenNodeData }
  | { type: 'transition'; data: TransitionEdgeData }
  | null;
