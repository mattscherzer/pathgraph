# App Journey & Screen Flow Architecture Visualizer

An interactive, modern React application built with TypeScript, Tailwind CSS, `@xyflow/react` (React Flow), and `dagre` to visualize application screen architectures, map user flows, and spotlight planned user journeys.

---

## Overview

Designing mobile and web applications requires clear mapping between screens, transitions, and user journeys. **App Journey & Screen Flow Architecture Visualizer** renders application architectures as interactive directed acyclic graphs (DAG) with automated positioning, dynamic path highlighting, inspection drawer, and live JSON schema import/export.

---

## Key Features

### 1. Automated DAG Graph Canvas
- **DAG Layout Engine**: Powered by `dagre` and `@xyflow/react` to calculate optimal screen positions and minimize edge crossing.
- **Orientation Switching**: Easily switch between **Horizontal (Left-to-Right)** and **Vertical (Top-to-Bottom)** graph hierarchies with one click.
- **Custom Screen Nodes**:
  - Screen title and monospace ID badge (`scr_...`).
  - Color-coded feature group tag (e.g., *Auth*, *Onboarding*, *Core*, *Monetization*, *Settings*).
  - Concise description preview and real-time incoming/outgoing connection counters.
  - Ordered step indicator badge (`Step 1`, `Step 2`, etc.) when participating in an active journey.
- **Custom Transition Edges**:
  - Shows clear user action labels (e.g., *"Tap Feed Item"*, *"No Session Found"*).
  - Clickable label badges to inspect transitions directly.
- **Navigation Controls**: Includes Mini-Map, zoom in/out, pan, and a **Center Graph** (Fit View) button.

### 2. User Journey Spotlighting & Dimming
- **Journey Navigator**: Switch between **All Screens (Overview)** and predefined user paths:
  - *First-Time Onboarding*: Registration, personalization, and feed entry.
  - *Returning User Feed Flow*: Session bypass directly into item discovery.
  - *Subscription Upgrade Funnel*: Content detail gate, paywall checkout, and entitlement unlock.
  - *Settings Plan Upgrade*: Navigating to account settings to trigger plan upgrades.
- **Selective Dimming**: Any screen or transition not part of the active journey drops to ~22% opacity and grayscale, drawing instant focus to the journey path.
- **Animated Highlights**: Participating screen nodes receive glowing indigo borders and accent rings, while edges become bold, accented, animated dashed lines.
- **Interactive Step Walkthrough**: Step through any journey in sequence using **Prev** / **Next** controls or direct step buttons (`1`, `2`, `3`), automatically centering and highlighting each screen in the canvas.

### 3. Detail Inspector Drawer
- **Screen Inspection**: Displays full description, feature group badge, incoming transitions (with clickable origins), outgoing transitions (with clickable destinations), and journey memberships.
- **Transition Inspection**: Displays the action label, origin screen, destination screen, and journeys utilizing the action.
- **Architecture Overview**: When nothing is selected, displays key metrics (total screens, transitions, journeys) and domain breakdowns.
- **Collapsible Drawer**: Toggleable via the inspector button for full-width canvas workspace.

### 4. JSON Schema Import & Export
- Edit, format, copy, or download the full architecture dataset in real-time.
- Built-in schema validator checks for missing fields, correct array structures, and duplicate IDs before applying updates to the live graph.
- Preset reset button to reload the default blueprint at any time.

### 5. Quick Element Creation Modal
- Add new screens or transitions through an intuitive modal without writing JSON manually.

---

## Data Schema

The visualizer consumes and produces clean, standardized JSON:

```json
{
  "screens": [
    {
      "id": "scr_splash",
      "name": "Splash / Gatekeeper",
      "group": "Auth",
      "description": "Initial startup route. Evaluates cached session tokens and app updates."
    },
    {
      "id": "scr_login",
      "name": "Login & Auth Wall",
      "group": "Auth",
      "description": "Credential input with Passkey, Magic Link, or social SSO sign-in."
    }
  ],
  "transitions": [
    {
      "id": "tr_1",
      "from": "scr_splash",
      "to": "scr_login",
      "label": "No Session Found"
    }
  ],
  "journeys": [
    {
      "id": "jrn_onboarding",
      "name": "First-Time Onboarding",
      "description": "Unauthenticated newcomer arrives, creates account, and configures preferences.",
      "pathScreenIds": ["scr_splash", "scr_login"],
      "pathTransitionIds": ["tr_1"]
    }
  ]
}
```

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 6+](https://vitejs.dev/)
- **Graph & Flow Rendering**: [@xyflow/react](https://reactflow.dev/) (React Flow)
- **Graph Layout Engine**: [dagre](https://github.com/dagrejs/dagre)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [lucide-react](https://lucide.dev/)
- **Animations**: CSS Keyframe Dash Animations + Motion

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `bun`

### Installation

1. Clone or download the repository to your local directory.
2. Install dependencies:

```bash
npm install
```

### Running Locally

Start the Vite development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Building for Production

Compile TypeScript and build the optimized production assets:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Type Checking & Linting

Run TypeScript type-checks without emitting output:

```bash
npm run lint
```

---

## How It Works

1. **Graph Compilation**: The app takes the architecture model (`screens`, `transitions`, `journeys`) and computes metadata such as inbound/outbound counts and active journey memberships.
2. **Dagre Layout Pipeline**: Nodes and edges are fed into `dagre.graphlib.Graph()` with configured rank separation, node dimensions (`260x130`), and direction (`LR` or `TB`).
3. **Reactive Highlighting**:
   - In `All Screens` mode, standard dark slate styling is applied to all elements.
   - When a journey is chosen, nodes and edges test for membership in `journey.pathScreenIds` and `journey.pathTransitionIds`.
   - Active path elements receive high z-index, glowing ring styles, and animated dashed SVG strokes, while excluded elements receive `opacity: 0.22` and CSS grayscale filtering.
4. **Interactive Synchronization**: Selecting nodes or edges in the canvas or journey walkthrough panel synchronizes with the Inspector drawer and viewport positioning.
