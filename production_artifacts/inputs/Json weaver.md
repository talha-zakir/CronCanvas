# Project Blueprint: JSONWeaver

### GitHub Repository Details
* **Repository Name:** `json-weaver` (or `jsonweaver.github.io`)
* **Repository Description:** A privacy-first, 100% client-side data visualizer that transforms raw JSON, YAML, and CSV structures into beautiful, interactive node-link diagrams completely inside the browser.

---

## 🏗️ Technical Implementation Plan

To ensure zero operating costs and total user privacy, this application runs entirely on the client side using static web assets hosted on GitHub Pages.

### 1. Core Architecture Layers
* **The Parser Layer (Data Ingestion):** * Parses incoming raw strings into a unified native JavaScript object structure.
  * Handles JSON natively via `JSON.parse()`.
  * Handles YAML utilizing the lightweight `js-yaml` library.
  * Handles CSV strings natively using `PapaParse` to convert tabular structures into array objects.
* **The Layout Compute Layer (Coordinate Generation):**
  * Feeds the parsed hierarchical data into **Dagre.js** (Directed Acyclic Graph layout engine).
  * Automatically calculates precise layout math (`X` and `Y` pixel coordinates) for every object and primitive field node, completely eliminating overlapping edges.
* **The Interactive Canvas Layer (UI Rendering):**
  * Renders nodes and connections via **React Flow** or **Reaflow**.
  * Renders node objects as standard HTML `<div>` elements styled dynamically with Tailwind CSS utility classes.
  * Draws connections between parent keys and child nested data nodes using fluid SVG `<path>` elements containing cubic Bezier curves and custom stroke dash properties.

### 2. Strategic Deployment Setup
* **Build Bundler:** Vite + React + TypeScript for near-instant client-side loading speeds and minimal production bundle footprint.
* **Hosting Platform:** Free static hosting via GitHub Pages via an automated GitHub Action workflow (`.github/workflows/deploy.yml`) compiling production assets on every main branch push.

---

## 🎯 Master Prompt for AI Builders & Generators
*Copy, paste, or input the detailed system prompt below into your favorite code assistant to instantly generate or iterate upon the foundational source code for this application.*

```text
Act as a Principal Frontend Engineer specializing in advanced data visualization and interactive canvases. 

Build a single-page React application hosted completely on the client side using Tailwind CSS, React Flow (or Reaflow), and Dagre.js for computing directed layouts. The goal is to build an absolute zero-backend clone of modern JSON tree visualization tools (like JSON Crack) where data privacy is guaranteed.

### Core Feature Specifications:
1. Split-Panel Interface: A simple, un-nested viewport panel system. The primary interface includes a code editor pane for raw data input and a broad canvas view area that automatically displays the graphical node-link layout output.
2. Multi-Format Input Parsing: Build robust data string listeners capable of safely converting incoming raw text blocks (JSON or YAML strings) into logical tree nodes. Gracefully capture parsing syntax exceptions without breaking or crashing the visual viewport canvas state.
3. Node Architecture & Data Tabulation: Every node box component must be drawn as an HTML-rendered element on the interactive canvas. Primitives (strings, booleans, numbers) must be compiled tightly into an embedded key-value grid or table format within their parent node box. When a key contains a nested child object or array list, render a separate, distinct child node.
4. Auto-Layout Graph Mechanics: Integrate Dagre.js to automatically compute optimized grid positions from top-to-bottom or left-to-right. Prevent nodes, layers, and text blocks from overlapping.
5. Bezier Curve Connections: Connect separate structural node items using high-performance SVG path lines featuring adjustable smooth Bezier layout properties and custom dash formatting styles.
6. Local Utilities: Ensure total client-side local execution loops. Do not connect to any outside cloud databases, metrics servers, or API pipelines. Maintain absolute local-first security so sensitive parameters remain entirely within the user's web thread.

Deliver modular, clean components split into a data parsing utility, a main layout canvas manager, and interactive edge routing elements. Use pure vanilla JavaScript or custom React hooks for tracking scale variables, canvas drag positions, and nested zoom interactions.