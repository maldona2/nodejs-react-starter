# AI Instruction Maintenance

- Keep rules split by context. Do not mix unrelated contexts in one file.
- Place each rule in an existing context file or create a new context file when no matching context exists.
- Treat user requests like "update your instructions" or "add this to your instructions" as requests to update files under `.ai/**`.
- Before editing instructions, clarify scope: global (`.ai/global/**`) or local (`.ai/local/**`).
- If scope is not specified, ask the user explicitly before applying changes.
- Apply the change in the matching context file; create a new file only when no matching context exists.
- For version-dependent instructions, mark them explicitly with `[VERSION-GATED]` and include activation condition in the same line (for example: `activate when vue-router >= 5`).

## Rule File Ordering Policy

- Keep numeric prefixes sorted by context priority:
  - `00-09`: governance and conflict policy.
  - `10-19`: project metadata and stack facts.
  - `20-29`: architecture sources and cross-cutting code boundaries.
  - `30-39`: backend code rules (core framework first, then packages, then other backend libraries).
  - `40-49`: frontend code rules (TypeScript first, then UI framework, then ecosystem libraries, then styling rules).
  - `50-59`: runtime/tooling consistency rules.
  - `60-79`: collaboration/process rules (VCS, review behavior, communication).
- Keep one context per file; do not reorder by date or author.
- When adding a new code rule, place it in the correct range and keep related files contiguous.
- When renaming/moving rule files, update all references in `.ai/**` in the same task.
