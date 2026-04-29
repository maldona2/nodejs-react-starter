# AI Rules And Skills Layout

This directory is the single source of AI-agent instructions for the repository.

## Structure

```
.ai/
  global/
    rules/   # committed, shared project rules
    skills/  # committed, shared reusable skills
  local/
    rules/   # user/machine-specific rules (only .gitkeep is committed)
    skills/  # user/machine-specific skills (only .gitkeep is committed)
```

## Governance

Canonical governance lives in:

- `global/rules/00-governance.md`
- `global/rules/05-instruction-maintenance.md`

Rule ordering (numeric prefix ranges and placement policy) is also defined in:

- `global/rules/05-instruction-maintenance.md`

This README is an index and should not duplicate operational rule content.

## Agent Entrypoints

- `AGENTS.md` is the coordinator and primary repository entrypoint.
- Agents that support `AGENTS.md` should use it directly.
- Agents that require another entrypoint file should use a local bridge file that imports/references `AGENTS.md`.
- Recommended local bridge files: `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `.cursor/rules/*.mdc`.
