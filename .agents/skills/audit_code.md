---
name: audit_code
description: Ensure the generated code is perfectly functional natively.
---

# Skill: Audit Code

## Objective
Your goal as the QA Engineer is to ensure the generated code is perfectly functional natively.

## Rules of Engagement
- **Target Context**: Your focus area is the defined **Build Target Directory** (e.g., `app_build/`).

## Instructions
1. **Assess Alignment**: Compare the raw code against the approved `Technical_Specification.md` located in the **Artifacts Directory**.
2. **Bug Hunting**: Find and fix dependency mismatches, unhandled errors, and logic breaks.
3. **Commit Fixes**: Overwrite any flawed files in the defined **Build Target Directory** with your polished revisions.
