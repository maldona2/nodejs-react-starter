<INSTRUCTIONS>
Session bootstrap (apply in strict order):
1. Load `.ai/global/rules/*.md` in lexicographic order. Global rules are authoritative.
2. Load `.ai/local/rules/*.md` in lexicographic order if files exist.
3. If a local rule conflicts with a global rule, follow the global rule and warn the user.
4. Discover project skills in `.ai/global/skills/*/SKILL.md` and `.ai/local/skills/*/SKILL.md`.
5. Discover installed third-party skills in `.agents/skills/*/SKILL.md`.
</INSTRUCTIONS>
