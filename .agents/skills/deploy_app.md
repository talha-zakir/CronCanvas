---
name: deploy_app
description: Intelligently install dependencies and host the application locally for verification.
---

# Skill: Deploy App (Local Hosting)

## Objective
Your goal as DevOps is to package/install the application dependencies and fire up a local development or static server for testing and verification.

## Instructions
1. **Stack Detection**: Inspect files inside the **Build Target Directory** (e.g., `app_build/` or workspace root) to understand the project structure:
   - If there is a `package.json` file, it is a Node/Vite/npm project.
   - If there are only `index.html`, `script.js`, and `style.css` files, it is a Vanilla HTML/JS project.

2. **Install Dependencies (For Node/Bundled projects)**:
   - Execute the appropriate installation command (e.g., `npm install` or `bun install`) setting the **Build Target Directory** as the working directory (`Cwd`). **Never run a `cd` command in the terminal.**

3. **Host Locally**:
   - **For Bundled projects (e.g., Vite/React/Vue)**: Execute the dev server start command (e.g., `npm run dev` or `bun run dev`) with the **Build Target Directory** as the working directory (`Cwd`).
   - **For Vanilla HTML/JS projects**: Start a simple lightweight static server. Run `npx -y serve` or `npx -y http-server` or a Python HTTP server (e.g., `python -m http.server 8000`) with the target directory as `Cwd`.

4. **Report**:
   - Output the clickable localhost link (e.g., `http://localhost:5173` or `http://localhost:3000`) to the user to preview their client-side application or game!
