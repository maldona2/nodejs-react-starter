# Governance

- If a local rule conflicts with a global rule, always follow the global rule and warn the user immediately.
- Before running shell commands, verify applicable local environment rules (OS/shell/path constraints) and execute commands accordingly; if constraints are unclear, ask the user first.
- Keep shared instructions in `.ai/global/**`.
- Keep user/machine-specific instructions in `.ai/local/**`.
- Do not commit local instruction files; only `.gitkeep` placeholders in `.ai/local/rules` and `.ai/local/skills` are allowed.
- Write rules and skills in English only.
- Keep instructions non-duplicated across files unless duplication is required for agent-specific entrypoints.
