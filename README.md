# 🚀 Antigravity Client-Side GitHub Pages Template

A highly modular, production-ready template designed for autonomous client-side application and game development with **Antigravity**. It targets zero-cost, privacy-first static hosting (HTML/JS/CSS, Vite, React, Vue) on **GitHub Pages** and defines a complete AI agent team (Product Manager, UI/UX Designer, Full-Stack Engineer, QA, and DevOps) orchestrating them using reusable skills and custom workflows.

---

## 📂 Template Structure

```text
├── .agents/
│   ├── agents.md             # Personas, constraints, and project configuration
│   ├── memory/
│   │   ├── handover.md       # Active project state, next steps, and choices
│   │   └── log.md            # Chronological agent interaction log
│   ├── workflows/
│   │   ├── startcycle.md     # Custom command to start the pipeline (/startcycle)
│   │   ├── resume.md         # Custom command to resume pipeline (/resume)
│   │   └── sync.md           # Custom command to manually save state (/sync)
│   └── skills/
│       ├── write_specs.md    # Product Manager: Client-side specification drafting
│       ├── generate_code.md  # UI/UX Designer & Engineer: Scaffold & static codebase build
│       ├── audit_code.md     # QA Engineer: Bug hunting, responsiveness & runtime audit
│       ├── deploy_app.md     # DevOps Master: Local development / static hosting preview
│       ├── deploy_ghpages.md # DevOps Master: Build and deploy to GitHub Pages
│       └── sync_memory.md    # System: Read & write persistent memory files
│
├── production_artifacts/     # Specs, architecture plans, and walkthroughs
├── app_build/                # Clean division for the final generated code
├── AGENTS.md                 # Root-level persona rules file matching .agents/agents.md
└── .gitignore                # Standard file exclusion for dependencies & secrets
```

---

## ⚙️ Configuration & Replicating

To reuse this template for a new static client-side utility application or game:
1. Copy the `.agents/` folder, `AGENTS.md`, and `.gitignore` file to your new project's root directory.
2. Configure paths inside `.agents/agents.md` if you want to write code directly to the root (`.`) or into an folder like `app_build/`.

```markdown
## Project Configuration
- **Build Target Directory**: `app_build` (Use `.` to build directly at the project root)
- **Artifacts Directory**: `production_artifacts`
```

---

## 🛠️ Usage

1. **Start the pipeline**: Run the custom workflow command:
   ```bash
   /startcycle <your-app-or-game-idea>
   ```
2. **Review Specifications**: The PM (`@pm`) will generate a comprehensive `Technical_Specification.md` in your **Artifacts Directory** (e.g. `production_artifacts/`) and pause. Review the static client-side architecture, add comments if needed, and reply `Approved` once ready.
3. **Execution**: The pipeline will automatically transition to coding (`@engineer`), checking for bugs and runtime stability (`@qa`), and packaging/deploying (`@devops`) to a local preview or GitHub Pages.

---

## 💾 Session Persistence & Context Resume

The template features an automated memory system. The active agent automatically updates the files in `.agents/memory/` after completing each major pipeline stage.

If your chat session's context window is getting full *mid-phase* (e.g., during a long coding or debugging session), you can manually force a save:
```bash
/sync
```

Once the state is saved, you can safely open a new chat window and type:
```bash
/resume
```
The agent will read the persistent memory, report the current state of the project, and automatically pick up exactly where you left off.
