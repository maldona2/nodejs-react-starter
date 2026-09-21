<INSTRUCTIONS>
Session bootstrap (apply in strict order):
1. Load `.ai/global/rules/*.md` in lexicographic order. Global rules are authoritative.
2. Load `.ai/local/rules/*.md` in lexicographic order if files exist.
3. If a local rule conflicts with a global rule, follow the global rule and warn the user.
4. Discover project skills in `.ai/global/skills/*/SKILL.md` and `.ai/local/skills/*/SKILL.md`.
5. Discover installed third-party skills in `.agents/skills/*/SKILL.md`.

Skill invocation is mandatory, not advisory:
- Before writing or editing any code, read the SKILL.md of every skill whose
  description matches the task, and follow it. Announce which skill you are using.
- Writing or changing tests, or being asked to raise coverage: you MUST read
  `.ai/global/skills/*-testing/SKILL.md` first.
- Running any build, test, lint, or database command: you MUST read
  `.ai/global/skills/*-workflow/SKILL.md` first.
- Debugging a failure: you MUST read `.agents/skills/systematic-debugging/SKILL.md` first.
- Implementing a feature or a bugfix: you MUST read
  `.agents/skills/test-driven-development/SKILL.md` first.
- "I already know how to do this" is not grounds for skipping a matching skill.

Completion:
- Do not report work as complete without showing output for `npm run lint`,
  `npm run format:check`, `npm run test`, and `npm run ai:check`.
</INSTRUCTIONS>
