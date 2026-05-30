# Project Handover & Context Memory

This file serves as the persistent memory for the Antigravity development team. It tracks the overall progress, architectural decisions, and current state so that development can be paused, resumed, or carried over to a new chat window when the context limits are reached.

---

## 📌 Project Overview
- **Goal / Description**: **JSONWeaver** — A privacy-first, 100% client-side data visualizer that transforms raw JSON, YAML, and CSV structures into beautiful, interactive node-link diagrams completely inside the browser.
- **Selected Tech Stack**: Vite, React, TypeScript, Tailwind CSS v4, Dagre.js (directed layout engine), @xyflow/react (interactive React Flow v12 canvas), js-yaml, PapaParse, SVG edges, html-to-image.

---

## 🏛️ Architectural & Key Decisions
- **Zero-Backend Design**: All data ingestion, parsing, layout computation, and rendering run entirely on the client side in the user's browser, ensuring absolute privacy and zero server costs.
- **Vite + React + TS**: Chosen for near-instant client-side loading, simple module imports, and structured code.
- **Tailwind CSS v4**: Set up using Vite's modern CSS-first `@tailwindcss/vite` plugin without tailwind.config files.
- **@xyflow/react (React Flow)**: High-performance interactive canvas supporting zooming, dragging, and custom node render templates.
- **Dagre.js Integration**: Automated, non-overlapping coordinates math for tree structures and nested acyclic graphs.
- **Relative Base Asset Routing**: Configured `base: './'` in `vite.config.ts` to allow automatic relative resolution of resources when hosted on any subpath of GitHub Pages.
- **Pastel Color Signature Coding**: Custom nodes automatically style their headers and borders using soft pastels according to their category (Root = Indigo, Array = Sky, Object = Orange/Coral) for enhanced tree readability.
- **Interactive Theme Preset Customization**: Built 5 soft pastel background theme presets (Slate, Cream, Sage, Lavender, Mint) selectable from a clean panel.
- **Base64 State Sharing Links**: Serializes current diagram text & format selection using base64 encoded URL hashes, allowing direct state restoration on reload without database requirements.
- **Graph Query Search Bar**: Real-time canvas filter mapping matching query strings to node titles, keys, and values, and highlighting matching items dynamically.
- **JSON Path Tooltips**: Property rows support native hover tooltips tracking the absolute JSON Path (e.g. `$.meta.version`) computed during recursion.
- **High-Res Diagram Snapshots**: Rewrote export logic to capture the internal `.react-flow__viewport` directly using `getViewportForBounds()`. This bypasses browser-level scaling artifacts and guarantees perfectly sharp geometric SVG edges at 2x density.
- **Geometric Edge Snapping**: Stripped default React Flow padding and minimum dimensions from connection Handles, forcing a mathematical 0x0 singularity offset to `-1px`. Lines now sit perfectly flush against the card borders.
- **Locked Horizontal Layout**: Eradicated the Top-to-Bottom directional toggle. Graph structures inherently merge relationship lineages when forced vertically; the engine is now strictly locked to Left-to-Right layout for maximum clarity.
- **Clean Connections (Removed Duplicate Edge Text)**: Removed duplicate edge labels along linking SVG lines, leaving names strictly in node card headers to avoid clutter.
- **HTML Font Loading**: Moved Google Font imports into `index.html` headers to prevent cross-origin stylesheet resolution bugs in SVG snapshots, ensuring text renders in the selected fonts.
- **Row-Level Handle Connections**: Outgoing connection lines originate directly from the specific property key row's handle (`sourceHandle`) inside parent cards, rather than central node points. This maps exactly which nested object belongs to which key.
- **Row-Level Collapse Triggers**: Expand/collapse toggle buttons (`+` / `−`) are placed directly next to the property keys inside the parent card rows. Clicking them hides or shows the downstream child sub-tree (edges and nodes), while keeping the parent card's properties list visible.
- **Export Pre-Processing (SVG Bounds & Opacity Reset)**: Injected custom DOM manipulation steps right before rendering in `html-to-image`. This temporarily sets physical `width`/`height` attributes on all SVGs to prevent 0x0 canvas collapse bugs in browsers, and temporarily overrides all node/edge opacities to `1` to bypass any active relational dimming/hover states, ensuring exported images are clean, clear, and fully drawn.
- **Cross-Platform CI/CD Hardening**: Configured GitHub Actions workflows to use `actions/setup-node@v4` with Node 22 (`FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true`) to resolve runner deprecation crashes. Replaced `npm ci` with `npm install` in the CI pipeline to dynamically fetch OS-specific optional dependencies, preventing lockfile mismatches when committing from Windows to an Ubuntu runner.

---

## 🔄 Current Pipeline State
- **Current Objective**: Successfully deployed to GitHub Pages and resolved CI/CD runner crashes caused by Node deprecation and cross-platform lockfile mismatches.

---

## 📋 Progress Checklist
- [x] **1. Requirements & Spec Drafting** (Owner: `@pm`)
- [x] **2. Specification Approval** (Owner: `User`)
- [x] **3. Scaffolding & Code Generation** (Owner: `@engineer` / `@designer`)
  - [x] Base Vite/React/TS app setup
  - [x] Installed parsing, layout, and visualization libraries (@xyflow/react, dagre, js-yaml, papaparse, html-to-image)
  - [x] Configured Tailwind CSS v4 with Vite integration
  - [x] Created parser layers (`src/utils/parser.ts`) and dagre engine (`src/utils/layout.ts`)
  - [x] Implemented UI viewpanels (`App.tsx`, `EditorPanel.tsx`, `CustomNode.tsx`, `GraphCanvas.tsx`)
- [x] **4. Bug Hunting & Security Audit** (Owner: `@qa`)
  - [x] Addressed tsconfig verbatimModuleSyntax strict imports
  - [x] Resolved React Flow Generic Node type conflicts
  - [x] Fixed PNG export SecurityError (CORS) from cross-origin stylesheets (Google Fonts / extensions)
  - [x] Restored correct viewport size on export clone and guaranteed fallback edge path styles
- [x] **5. Local Hosting & Testing** (Owner: `@devops`)
  - [x] Verified local build successfully (`npm run build` succeeds)
  - [x] Generated `.github/workflows/deploy.yml` for automated push deployment
  - [x] Implemented row-level connection handles, inline row collapses, and high-res diagram exports
- [x] **6. Production Deployment to GitHub Pages** (Owner: `User` / `@devops`)
  - [x] Pushed to GitHub and updated CI workflow for Node 24 compatibility
  - [x] Replaced `npm ci` with `npm install` to avoid Windows/Ubuntu lockfile clashes
  - [x] Live via user-configured Pages settings

---

## 🛠️ Modified Files & Structure
- `app_build/package.json`: Dependency manifests (includes html-to-image)
- `app_build/vite.config.ts`: Vite bundler configuration (with Tailwind plugin & base routing)
- `app_build/index.html`: Preconnected Google Fonts and title variables (added crossorigin to link tags)
- `app_build/src/index.css`: Stylesheet with Tailwind CSS v4 imports (added fallback edge styling and corrected viewport overflow sizing)
- `app_build/src/utils/parser.ts`: JSON/YAML/CSV structure mapping engine with pathing, collapsible filters, and parent-child link tracking
- `app_build/src/utils/layout.ts`: Dagre graph positioning coordinates layout engine
- `app_build/src/components/CustomNode.tsx`: Syntax-colored grid renderer with type-coded pastel headers, row-level handles, JSON Path tooltips, and inline branch expand/collapse toggles
- `app_build/src/components/GraphCanvas.tsx`: Interactive zoom/pan viewport with theme selection presets, search integration, fitView bindings, and high-res image exporter (wrapped in withSafeExport utility)
- `app_build/src/components/EditorPanel.tsx`: Code input editor with syntax checker
- `app_build/src/App.tsx`: Main interface orchestrator with state sharing hooks, header query bar, and collapsible tracking arrays wrapped in ReactFlowProvider
- `.github/workflows/deploy.yml`: GitHub Actions reusable deployment workflow

---

## ⚠️ Known Issues / Next Actions
1. **NEXT**: The user has been presented with the completed PNG export fix. Ready for deployment or further UI/UX improvements.
