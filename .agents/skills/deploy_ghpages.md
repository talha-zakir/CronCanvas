---
name: deploy_ghpages
description: Package the client-side application or game and deploy it to GitHub Pages.
---

# Skill: Deploy to GitHub Pages

## Objective
Your goal as DevOps is to package the static application/game and deploy it to GitHub Pages.

## Instructions
1. **Prepare Build Configuration**:
   - Inspect `package.json` in the **Build Target Directory** (`app_build/` or project root) to verify there is a build script (e.g., `"build": "vite build"` or similar) and that the base URL path is correctly configured for GitHub Pages (typically `./` or `/<repository-name>/` in the bundler configuration to ensure relative asset path resolution).
   
2. **Compile Static Assets**:
   - Run the build command (e.g., `npm run build` or `bun run build`) with the **Build Target Directory** set as the working directory (`Cwd`). **Never run a `cd` command in the terminal.**
   - Verify that the static output directory (e.g., `dist/`, `build/`, or similar) is successfully generated.

3. **Deploy to GitHub Pages**:
   - **Method A (Local CLI)**: Use the `gh-pages` package to publish the build directory directly to the `gh-pages` branch. Run:
     ```bash
     npx gh-pages -d <build_dir>
     ```
     (e.g., `npx gh-pages -d dist` or `npx gh-pages -d build`) from the **Build Target Directory**.
   - **Method B (GitHub Actions)**: Create/configure a GitHub Actions workflow in `.github/workflows/deploy.yml` to automatically build and deploy the application when pushed to the main branch. 
     **CRITICAL GITHUB ACTIONS RULES:**
     1. Set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` in the workflow `env` and use `actions/setup-node@v4` with `node-version: 22` (or 24) to avoid Node 20 deprecation failures.
     2. Use `actions/configure-pages@v5`.
     3. ALWAYS use `run: npm install` (NOT `npm ci`) in the CI pipeline if the local `package-lock.json` was generated on a Windows host, as `npm ci` strictly enforces the lockfile and will crash on Ubuntu runners due to missing OS-specific optional dependencies (like `@emnapi/core`).

4. **Report**:
   - Output the live production GitHub Pages URL (e.g., `https://<username>.github.io/<repository-name>`) and instruct the user to push to Git or verify the deployed site.

5. **Generate Portfolio Integration Card**:
   - Always run the `generate_portfolio_card.md` skill immediately after deployment to generate the JSX component so the user can easily feature the deployed app on their primary website.
