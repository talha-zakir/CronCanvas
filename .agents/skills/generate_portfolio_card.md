---
name: generate_portfolio_card
description: Generate a React JSX card component for the user's primary portfolio website to feature the newly built project.
---

# Skill: Generate Portfolio Card

## Objective
The final step of any project deployment in this template is to generate a styled React component (JSX) that perfectly matches the user's primary GitHub portfolio (`https://talha-zakir.github.io/`) so they can easily showcase the new project.

## Instructions
1. Gather the project's **Name**, a short **Description**, its **Tech Stack** (e.g., React, Tailwind v4, Vite, etc.), and the **Live GitHub Pages URL**.
2. Generate a `.tsx` file in the **Artifacts Directory** (e.g. `production_artifacts/<project_name>_portfolio_card.tsx`).
3. Use the following exact React/Tailwind template structure, preserving all specific classes (`bg-navy-light`, `text-teal-neon`, etc.) to match the user's portfolio UI.

### Template Structure:
```tsx
{/* [PROJECT NAME] Card */}
<div className="p-5 bg-navy-light rounded-lg border border-slate-medium/10 hover:border-teal-neon/30 hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
  <div>
    <h3 className="text-base font-semibold text-slate-lightest mb-2">[PROJECT NAME]</h3>
    <p className="text-xs text-slate-medium mb-4 leading-relaxed">
      [1-2 sentence compelling project description]
    </p>
    <div className="flex flex-wrap gap-1.5 mb-4">
      {/* Repeat this span for each major technology used */}
      <span className="px-2 py-0.5 bg-navy-deep border border-slate-medium/20 text-[10px] font-mono text-teal-neon rounded">[TECH]</span>
    </div>
  </div>
  <a 
    href="[LIVE GITHUB PAGES URL]" 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-full text-center py-1.5 bg-teal-neon/10 hover:bg-teal-neon/20 border border-teal-neon/40 hover:border-teal-neon text-teal-neon text-xs font-semibold rounded font-mono transition block"
  >
    Visit Project ↗
  </a>
</div>
```

4. Do NOT use the `<button>` inline app launcher format from the user's utility modules. ALWAYS use the `<a href="..." target="_blank" className="... block">Visit Project ↗</a>` tag since this template outputs standalone GitHub Pages applications.
5. Notify the user that the integration card has been created in the `production_artifacts` folder and is ready to be pasted directly into their portfolio's `App.tsx` grid.
