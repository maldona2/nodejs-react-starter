# AI Agent Configuration

The repository uses one canonical project-instruction system with small
compatibility adapters for individual coding agents.

## Responsibilities

```text
AGENTS.md                 Cross-agent bootstrap and loading order
.ai/
  global/
    rules/                Committed, canonical project instructions
    skills/               Committed, project-specific workflows
  local/
    rules/                Ignored user or machine overrides
    skills/               Ignored user or machine workflows
  tools/                  Configuration validation
.agents/
  skills/                 Installed third-party skills
skills-lock.json          Sources and hashes for third-party skills
.claude/
  CLAUDE.md               Thin Claude Code bridge to AGENTS.md
  skills/                 Claude-compatible links to .agents/skills
  commands/               Claude-only commands
  settings.local.json     Ignored machine-local permissions
```

Project rules belong in `.ai/global/rules/`. Project-specific repeatable
workflows belong in `.ai/global/skills/`. Third-party skills belong in
`.agents/skills/` and must remain represented in `skills-lock.json`.

Do not copy project facts or rules into an agent-specific entrypoint. An agent
that does not support `AGENTS.md` directly should use a thin bridge that imports
or references it.

## Loading And Precedence

`AGENTS.md` defines the complete bootstrap sequence. Global rules are
authoritative. Local rules are loaded for machine-specific context, but cannot
override a conflicting global rule.

Rules are discovered in lexicographic order. Their numeric prefix policy lives
in `global/rules/05-instruction-maintenance.md`.

## Local Files

Only `.gitkeep` placeholders under `.ai/local/` are committed. Local rules,
local skills, and `.claude/settings.local.json` are ignored by Git.

## Validation

Run the repository check after changing AI configuration:

```bash
npm run ai:check
```

The check validates entrypoints, local ignore rules, installed and locked
skills, Claude skill bridges, and the canonical rule layout.
