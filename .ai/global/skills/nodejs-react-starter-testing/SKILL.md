---
name: nodejs-react-starter-testing
description: Write and review tests for this project. Use whenever adding tests, generating tests for existing code, changing a route or service, or asked to raise coverage.
---

# Testing Runbook

Commands live in `nodejs-react-starter-workflow`. Security requirements live in
`.ai/global/rules/30-backend-security.md` and `40-frontend-security.md`.

## The One Rule

**Derive assertions from the requirement, never from the observed behavior of
the code under test.**

Generating a test by reading an implementation and asserting what it currently
does encodes the bug instead of catching it. The suite then goes green over a
defect forever. If the requirement is not written down, ask for it or state the
assumption in the test name — do not read it off the implementation.

Before writing a test for existing code, answer in one line: *what is this
supposed to do?* If the only available answer is *what the code does*, stop and
say so.

## Order Of Work

1. Write the failing test first. Run it. Confirm it fails for the stated reason.
2. Write the minimum implementation. Run it. Confirm it passes.
3. Never write test and implementation in the same edit.

## Required Cases Per Route

A route is not tested until all of these exist:

- Rejected input — invalid body, missing required field, wrong type, over-length.
- Unauthorized — no credential.
- Forbidden — valid credential, resource belonging to another subject.
- Not found — well-formed id that does not exist.
- Happy path — last, not first.

The negative cases are the deliverable. A suite of happy paths tells you nothing
about whether the boundary holds.

## Required Cases Per Service

- Boundary values on every numeric or length-bounded parameter.
- The error branch of every `try`/`catch` and every early return.
- Failure of each external dependency it calls (db down, timeout).

## What Not To Assert

- Do not assert on log output, timing, or internal call counts as a proxy for
  behavior. Assert observable outputs and persisted state.
- Do not snapshot whole response objects; a snapshot accepts whatever it is
  given, including a leaked field.
- Do not mock the thing under test.

## Coverage

Coverage is a floor, not a goal — line and branch coverage are statistically
indistinguishable between suites that catch real bugs and suites that do not.
Do not raise a coverage number by adding assertion-free tests that execute code.

For a security-relevant module, the meaningful check is mutation-style: change
the guard (flip a comparison, delete a validation) and confirm a test fails. If
nothing fails, the module is uncovered regardless of its coverage percentage.

## Layout

- Backend (Jest): `backend/src/**/*.test.ts` or `backend/src/**/__tests__/*.ts`
- Frontend (Vitest): `frontend/src/**/*.test.ts(x)`
- Name tests for the requirement: `returns 403 when the resource belongs to
  another user`, not `test errorHandler 2`.
