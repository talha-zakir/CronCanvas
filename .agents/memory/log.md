# Chronological Development Log

This log registers every major milestone, transition, and action completed by the development team.

| Timestamp | Agent / Role | Action Taken | Details / Outcomes |
| :--- | :--- | :--- | :--- |
| 2026-05-28T07:28 | @pm | Spec Reviewed & Plan Created | Full 8-phase implementation plan created with DB schema, file tree, tech stack. 5 open questions raised. |
| 2026-05-28T07:36 | User | Decisions Locked In | Tailwind v3, Resend, Shadcn Date Picker, configurable limits (5pg/10MB), optional client email. |
| 2026-05-28T07:38 | @engineer | Memory Synced | Handover updated. Beginning Phase 1: Project Init & Scaffolding. |
| 2026-05-28T07:59 | @devops | Local Host Execution Started | Started local dev host. Discovered missing Supabase env URL/Anon keys. |
| 2026-05-28T08:01 | @engineer | Sandbox Mode Implemented | Built file-based mock database, local public storage, cookie-based sessions, and console-log emails to bypass external dependencies. |
| 2026-05-28T08:03 | @qa | SSR DOMMatrix Error Resolved | Troubleshooting dynamic loading for `pdfjs-dist` to prevent Node execution of browser constructors during server builds. |
| 2026-05-28T08:05 | @devops | Local Host Verified | Rebuilt local host successfully. Verified page render `/fill/sample-auto` and `/signup` without warning. Memory synced. |
| 2026-05-30T07:13 | @system | Template Repurposed | Reset workspace template from PDFSignet Next.js to JSONWeaver client-side GitHub Pages, updating personas, skills, and workflows to be generic. |
| 2026-05-30T07:22 | @devops | Scaffolding & Build Tested | Scaffolded Vite+React+TS boilerplate in app_build. Installed React Flow, Dagre, js-yaml, PapaParse, and Tailwind CSS v4. Implemented and validated JSONWeaver. Build succeeded. |
| 2026-05-30T07:27 | @designer | Pastel Theme & Customizer Added | Redesigned node cards with type-coded pastel headers/borders and built a compact 5-preset background color picker (Slate, Cream, Sage, Lavender, Mint) inside the layout panel. |
| 2026-05-30T07:29 | @engineer | Sharing & Search Features Added | Added URL-hash-based state serialization (Share Link) and real-time node query filtering (Search Bar) to the header. Tested compilation successfully. |
| 2026-05-30T07:32 | @engineer | Collapses, Tooltips & Exports Added | Integrated expandable/collapsible nodes (triggering Dagre layout snaps), absolute JSON Path tooltips on row hover, and client-side PNG image downloads. Verified build passes. |
| 2026-05-30T07:35 | @devops | Exports & Connection Styling Improved | Removed duplicate edge labels for clean line linkages. Added fitView triggers and preconnected HTML head font links to fix cross-origin text bugs on PNG snapshots. Verified build succeeded. |
| 2026-05-30T07:38 | @engineer | Row-Level Connection Handles Added | Restored parentKey parameter on edges and created specific sourceHandles inside the value cells of non-primitive rows. Connection lines now point exactly from the key that owns the child card. Verified build succeeds. |
| 2026-05-30T07:42 | @engineer | Row-Level Collapse Controls Added | Relocated expand/collapse triggers from child headers to parent property key rows. Collapsing a parent row hides the child branch and socket handle cleanly. Tested and built. |
| 2026-05-30T09:10 | @engineer | SVG Fixes & Layout Simplification | Rewrote React Flow export logic using getViewportForBounds for crisp SVGs. Removed Top-to-Bottom (TB) layout to simplify relationships. Zeroed out Handle padding for geometric precision on edges. Memory Synced. |
| 2026-05-30T09:36 | @engineer | PNG Export Lines Bug Fixed | Resolved html-to-image cssRules SecurityError crash caused by CORS-restricted external styles (Google Fonts, extensions) by adding crossorigin attribute and a custom withSafeExport DOM wrapper. Restored correct viewport size on clone. Verified build succeeds. |
| 2026-05-30T09:42 | @engineer | Export Pre-Processing & Opacity Bypass | Added dynamic SVG width/height attribute injection during export to prevent 0x0 canvas collapse bugs in certain browsers, and temporarily forced all node/edge opacities to 1 to bypass relational dimming. Verified build succeeds. |
| 2026-05-30T09:46 | @engineer | Root Container Export Capture | Shifted snapshot target from .react-flow__viewport to the root .react-flow container. Uses useReactFlow's fitView/setViewport to programmatically frame the canvas during snapshot. Preserves full DOM hierarchy, CSS positioning, and stylesheets. Verified build succeeds. |
| 2026-05-30T09:50 | @engineer | Handle Sizing Restored | Restored default physical sizes to input/output handles (with opacity-0) to resolve a layout calculation bug where 0x0 element bounding boxes caused lines to drop off or fail to align in some export engines. Verified build succeeds. |
| 2026-05-30T09:53 | @engineer | Relational Dimming Excised | Removed the hover relational dimming feature entirely, restoring nodes and edges to permanent 100% opacity to ensure lines render reliably and don't disappear in user exports. Verified build succeeds. |
| 2026-05-30T10:50 | @devops | CI/CD Pages Deployment Fixed | Configured GitHub Actions to use Node 22 (`FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true`) to resolve deprecation crashes. Swapped `npm ci` for `npm install` to dynamically resolve cross-platform dependencies (preventing `@emnapi` lockfile errors from Windows-to-Ubuntu CI mismatches). |
| 2026-05-30T15:55 | @engineer | Portfolio Integration Designed | Cloned user's personal website repo to analyze styling. Generated an exact-match React component (`jsonweaver_portfolio_card.tsx`) implementing the exact Tailwind layout and styling used in their primary portfolio for cross-site cohesion. |





