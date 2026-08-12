// Keep expected error logs out of test output. Tests assert on responses,
// never on log lines — see .ai/global/skills/*-testing/SKILL.md.
process.env.LOG_LEVEL = 'silent';
