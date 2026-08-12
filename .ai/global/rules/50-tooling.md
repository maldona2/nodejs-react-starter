# Runtime And Tooling Consistency

- Run the workflow commands from `.ai/global/skills/*-workflow/SKILL.md`.
  Do not invent ad-hoc commands when a package script exists.
- Before reporting work complete, run and show output for: `npm run lint`,
  `npm run format:check`, `npm run test`, and `npm run ai:check`. A completion
  claim without command output is not a completion claim.
- CI runs the same four commands. Anything that fails locally fails the pull
  request; do not push expecting CI to differ.
- After changing anything under `.ai/**`, `.agents/skills/**`, `AGENTS.md`,
  `.claude/**`, or `skills-lock.json`, run `npm run ai:check` in the same task.
- Every skill in `skills-lock.json` must exist at `.agents/skills/<name>/SKILL.md`
  and be linked at `.claude/skills/<name>`. Adding a skill means updating all
  three in one change.
- Node version is pinned by the Docker images and CI matrix. Do not use APIs
  newer than the pinned runtime.
