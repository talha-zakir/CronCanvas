# 🚀 Cron Canvas

A bi-directional, privacy-first Cron expression builder and visualizer that translates complex schedule syntax into human-readable text and calculates future execution dates instantly.

Built with the **Antigravity** Client-Side Template.

---

## 🎯 Features

- **Visual Builder:** Categorized tabs for Minutes, Hours, Days, Months, and Weekdays with toggle buttons and dropdowns.
- **Bi-Directional Text Input:** Syncs directly with the visual builder. Typing updates buttons, and buttons update text.
- **Human-Readable Translation:** Instantly translates the active cron string into plain English.
- **Next Execution Calculator:** Calculates and displays the next 5 upcoming execution times in the user's local timezone.
- **Privacy-First:** 100% client-side execution. No data leaves your browser.

## 📂 Project Structure

```text
├── .agents/                  # Autonomous development team constraints and memory
├── production_artifacts/     # Specs, architecture plans, and inputs (CronCanvas.md)
├── app_build/                # The React + Vite client-side application
├── AGENTS.md                 # Root-level persona rules file
└── .gitignore                # Standard file exclusions
```

## 🛠️ Tech Stack

- **Framework**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Core Libraries**: `cronstrue` (translation), `cron-parser` (execution dates), `date-fns` (date formatting)
- **Deployment**: GitHub Pages via GitHub Actions

---

## ⚙️ Development

1. Navigate to the app directory:
   ```bash
   cd app_build
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
