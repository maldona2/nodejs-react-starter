# VCS Rules

- Use Conventional Commits: `<type>[(scope)]: <subject>` (header ≤72 chars, 50 recommended).
- Types (lowercase only): build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test.
- Subject: imperative present tense, lowercase start, no trailing dot.
- Use header-only commit messages unless body adds non-obvious context (why/trade-offs, not what).
- Body lines: max 72 characters each; use only when context is non-obvious.
- For file moves/renames, use `git mv` so Git tracks renames explicitly.
- Never add AI mentions, AI-generated disclaimers, or AI attribution trailers to commit messages.
- Never add AI-generated disclaimers to code comments.
- Mandatory pre-commit checklist: verify staged scope matches task, validate message format.
- Mandatory post-commit report: include commit hash and confirm message was validated.
