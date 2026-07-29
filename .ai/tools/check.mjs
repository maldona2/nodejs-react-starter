#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const errors = [];
const warnings = [];

const REQUIRED_FILES = [
    'AGENTS.md',
    '.ai/README.md',
    '.ai/global/rules/00-governance.md',
    '.ai/tools/check.mjs',
    '.claude/CLAUDE.md',
    'skills-lock.json',
];

const REQUIRED_AGENTS_SNIPPETS = [
    '.ai/global/rules/*.md',
    '.ai/local/rules/*.md',
    '.ai/global/skills/*/SKILL.md',
    '.ai/local/skills/*/SKILL.md',
    '.agents/skills/*/SKILL.md',
];

const REQUIRED_GITIGNORE_SNIPPETS = [
    '.ai/local/rules/*',
    '!.ai/local/rules/.gitkeep',
    '.ai/local/skills/*',
    '!.ai/local/skills/.gitkeep',
    '.claude/settings.local.json',
];

const LOCAL_ALLOWED_TRACKED = new Set([
    '.ai/local/rules/.gitkeep',
    '.ai/local/skills/.gitkeep',
]);

function isGitUnavailable(message) {
    return /git: not found|git is not recognized|ENOENT/i.test(message);
}

function fileExists(relPath) {
    return fs.existsSync(path.join(ROOT, relPath));
}

function readText(relPath) {
    return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function addError(message) {
    errors.push(message);
}

function addWarning(message) {
    warnings.push(message);
}

function walkFiles(dir) {
    const result = [];

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const absPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            result.push(...walkFiles(absPath));
            continue;
        }
        result.push(absPath);
    }

    return result;
}

function collectGlobalRuleFiles() {
    const rulesDir = path.join(ROOT, '.ai/global/rules');
    if (!fs.existsSync(rulesDir)) {
        return [];
    }
    return walkFiles(rulesDir).filter((absPath) => path.extname(absPath).toLowerCase() === '.md');
}

function collectGlobalSkillFiles() {
    const skillsDir = path.join(ROOT, '.ai/global/skills');
    if (!fs.existsSync(skillsDir)) {
        return [];
    }
    return walkFiles(skillsDir).filter((absPath) => path.basename(absPath) === 'SKILL.md');
}

for (const relPath of REQUIRED_FILES) {
    if (!fileExists(relPath)) {
        addError(`Missing required file: ${relPath}`);
    }
}

if (fileExists('AGENTS.md')) {
    const agents = readText('AGENTS.md');
    for (const snippet of REQUIRED_AGENTS_SNIPPETS) {
        if (!agents.includes(snippet)) {
            addError(`AGENTS.md must contain bootstrap snippet: ${snippet}`);
        }
    }
}

if (fileExists('.claude/CLAUDE.md')) {
    const claude = readText('.claude/CLAUDE.md');
    if (!claude.includes('@../AGENTS.md')) {
        addError('.claude/CLAUDE.md must import the canonical AGENTS.md entrypoint');
    }
    if (/^## Tech Stack$/m.test(claude)) {
        addError('.claude/CLAUDE.md must be a thin bridge and must not duplicate project instructions');
    }
}

if (fileExists('.gitignore')) {
    const gitignore = readText('.gitignore');
    for (const snippet of REQUIRED_GITIGNORE_SNIPPETS) {
        if (!gitignore.split(/\r?\n/).includes(snippet)) {
            addError(`.gitignore must contain AI-local ignore rule: ${snippet}`);
        }
    }
}

if (fileExists('skills-lock.json')) {
    try {
        const lock = JSON.parse(readText('skills-lock.json'));
        for (const skillName of Object.keys(lock.skills ?? {})) {
            const installedSkill = `.agents/skills/${skillName}/SKILL.md`;
            const claudeSkill = `.claude/skills/${skillName}`;
            if (!fileExists(installedSkill)) {
                addError(`Locked skill is not installed: ${installedSkill}`);
            }
            if (!fileExists(claudeSkill)) {
                addError(`Locked skill is not exposed to Claude: ${claudeSkill}`);
            }
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        addError(`Unable to parse skills-lock.json: ${message}`);
    }
}

if (fileExists('package.json')) {
    try {
        const packageJson = JSON.parse(readText('package.json'));
        if (packageJson.scripts?.['ai:check'] !== 'node .ai/tools/check.mjs') {
            addError('package.json must expose the AI configuration check as npm run ai:check');
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        addError(`Unable to parse package.json: ${message}`);
    }
}

const globalRuleFiles = collectGlobalRuleFiles();
if (globalRuleFiles.length === 0) {
    addError('No global rule files found in .ai/global/rules/*.md');
} else {
    const versionGatedRuleFiles = [];
    for (const absPath of globalRuleFiles) {
        const relPath = path.relative(ROOT, absPath).replaceAll('\\', '/');
        const text = fs.readFileSync(absPath, 'utf8');
        const markers = (text.match(/^\s*-\s*\[VERSION-GATED\]/gm) ?? []).length;
        if (markers > 0) {
            versionGatedRuleFiles.push({ relPath, markers });
        }
    }
    if (versionGatedRuleFiles.length > 0) {
        const totalMarkers = versionGatedRuleFiles.reduce((sum, item) => sum + item.markers, 0);
        const fileList = versionGatedRuleFiles.map((item) => `${item.relPath} (${item.markers})`).join(', ');
        addWarning(
            `Version-gated AI rules detected: ${totalMarkers} marker(s) across ${versionGatedRuleFiles.length} file(s): ${fileList}. Review these notes when dependency versions change.`,
        );
    }
}

const globalSkillFiles = collectGlobalSkillFiles();
if (globalSkillFiles.length === 0) {
    addError('No global skill files found in .ai/global/skills/*/SKILL.md');
}

if (fileExists('.ai/global')) {
    const textGlobalFiles = walkFiles(path.join(ROOT, '.ai/global')).filter((absPath) => {
        const ext = path.extname(absPath).toLowerCase();
        return ext === '.md' || ext === '.mdc' || path.basename(absPath) === 'SKILL.md';
    });
    for (const absPath of textGlobalFiles) {
        const relPath = path.relative(ROOT, absPath).replaceAll('\\', '/');
        const text = fs.readFileSync(absPath, 'utf8');
        if (/[Ѐ-ӿ]/.test(text)) {
            addError(`Cyrillic detected in global AI file: ${relPath}`);
        }
    }
}

let trackedFiles = [];
try {
    trackedFiles = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' })
        .split(/\r?\n/)
        .filter(Boolean);
} catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (isGitUnavailable(message) && !process.env.CI) {
        process.stderr.write('AI config check warning: git is unavailable, local tracked-file validation is skipped.\n');
    } else {
        addError(`Unable to read tracked files via git: ${message}`);
    }
}

for (const tracked of trackedFiles) {
    if (!tracked.startsWith('.ai/local/')) {
        continue;
    }
    if (!LOCAL_ALLOWED_TRACKED.has(tracked)) {
        addError(`Tracked local AI file is not allowed: ${tracked}`);
    }
}

if (errors.length > 0) {
    console.error('AI config check failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    for (const warning of warnings) {
        console.error(`AI config check warning: ${warning}`);
    }
    process.exit(1);
}

for (const warning of warnings) {
    process.stderr.write(`AI config check warning: ${warning}\n`);
}

process.stdout.write('AI config check passed.\n');
