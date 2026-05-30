# Project Blueprint: CronCanvas

### GitHub Repository Details
* **Repository Name:** `cron-canvas` (or `croncanvas.github.io`)
* **Repository Description:** A bi-directional, privacy-first Cron expression builder and visualizer that translates complex schedule syntax into human-readable text and calculates future execution dates instantly.

---

## 🏗️ Technical Implementation Plan

This tool relies on rapid text processing and date calculations. It runs 100% on the client side, meaning server administrators can paste proprietary schedules without exposing their internal operational rhythms to external analytics servers.

### 1. Core Architecture Layers
* **The UI Input Layer (Bi-Directional):**
  * **Visual Builder:** A clean set of categorized tabs (Minutes, Hours, Days, Months, Weekdays) with pill-shaped toggle buttons and dropdowns (e.g., "Every X minutes", "On specific days").
  * **Text Input:** A large, centered, monospace text input field where power users can directly type or paste a 5-part cron string (e.g., `15 14 1 * *`).
  * *Crucial Interaction:* These two inputs must be deeply synchronized. Clicking a UI button updates the text string; typing in the text string updates the active UI buttons.
* **The Parser & Translation Layer:**
  * Utilize the open-source library `cronstrue` to instantly translate the active cron string into localized, human-readable text (e.g., "At 02:15 PM, on day 1 of the month").
* **The Temporal Engine (Execution Dates):**
  * Utilize the open-source library `cron-parser` to ingest the cron string and calculate the exact UNIX timestamps for the next 5 upcoming executions.
  * Format these execution dates cleanly using a lightweight date library (like `date-fns`) to display localized timestamps to the user.

### 2. Strategic Deployment Setup
* **Build Bundler:** Vite + React + TypeScript to ensure the date-parsing libraries are tree-shaken and bundled into a tiny, fast-loading application.
* **Hosting Platform:** GitHub Pages via an automated GitHub Action workflow (`.github/workflows/deploy.yml`).

---

## 🎯 Master Prompt for AI Builders & Generators
*Copy, paste, or input the detailed system prompt below into your favorite code assistant to generate the core logic and interface.*

```text
Act as a Principal Frontend Engineer. Build a single-page React application hosted completely on the client side using Tailwind CSS that functions as a bi-directional Cron Expression Builder.

### Core Feature Specifications:
1. Bi-Directional Synchronization: Build a UI featuring a prominent, editable text input field for a 5-part cron string (defaulting to `* * * * *`). Below it, render a set of interactive form controls (tabs for Minute, Hour, Day, Month, Weekday) containing selectable buttons and range inputs. Updating the form controls must instantly update the text input string, and typing in the text input string must instantly reflect the correct states in the form controls.
2. Human-Readable Translation: Use the `cronstrue` library (or equivalent custom logic) to read the active cron string and render a large, highly readable English sentence explaining exactly when the job will run. Update this sentence on every keystroke or button click. 
3. Invalid State Handling: If the user manually types an invalid cron string, immediately catch the error gracefully. Change the text input border to red and replace the human-readable text with a clear syntax error message. Do not let the app crash.
4. Next Execution Calculator: Use the `cron-parser` library. Create a dedicated visual panel that takes the current valid cron string, calculates the next 5 upcoming execution times based on the user's local browser timezone, and displays them in a clean, vertical list formatted elegantly (e.g., "Tuesday, Oct 24, 2024 at 14:15").
5. UX Polish: Include a single-click "Copy to Clipboard" button next to the cron string input. Use a clean, modern aesthetic with ample whitespace, utilizing standard Tailwind utility classes. Maintain absolute local-first security so no data leaves the browser thread.