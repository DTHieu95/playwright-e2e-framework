---
name: triage-ci-failure
description: Use when a GitHub Actions run on this repo failed and the user wants root-cause analysis of failing Playwright tests — fetches logs, traces, and Allure results, then categorizes the failure
---

# Triage CI Failure

Systematic root-cause analysis for a failed CI run. Replaces hours of manual log scrolling with a structured fetch → categorize → propose-fix loop.

## Usage

`/triage-ci-failure <run-id>` — `<run-id>` is the GitHub Actions run number or URL.

If no run ID is provided:

```bash
gh run list --workflow=ci.yml --status=failure --limit=1
```

## What this repo produces on failure

`.github/workflows/ci.yml` uploads these artifacts on every run:

| Artifact | Content | Use |
|----------|---------|-----|
| `blob-report-1`, `blob-report-2` | Per-shard Playwright blob reports | Reconstructing the merged HTML report |
| `playwright-html-report` | Merged HTML with traces, screenshots, video | First place to look for any failed test |
| `allure-results-1`, `allure-results-2` | Per-shard Allure raw results | Step-by-step timeline with allure annotations |
| `allure-report` | Full Allure dashboard | Trend comparison across runs (also published to gh-pages on `main`) |

Traces are embedded inside the Playwright HTML report under each failed test.

## Workflow

### Step 1 — Fetch the run summary

```bash
gh run view <run-id>
gh run view <run-id> --log-failed > /tmp/ci-failed.log
```

Read `/tmp/ci-failed.log`. Extract:

- Which job(s) failed: `lint-and-typecheck`, `test (shard 1/2)`, `test (shard 2/2)`, `merge-reports`, `publish-allure`
- The first failed test name in each failing shard
- Any non-test failure (npm ci, browser install, snapshot mismatch, artifact upload)

### Step 2 — Classify before downloading

| Class | Signal in log | Next |
|-------|---------------|------|
| Lint/typecheck/format | `npm run lint`, `npm run typecheck`, or `npm run format:check` failed | Read error, fix the source file. No artifacts needed. |
| Browser install | `npx playwright install` failed | Likely transient. Re-run. If reproducible, check `@playwright/test` version pin. |
| Visual baseline mismatch | `toHaveScreenshot()` failed in the `visual-*` projects | Step 4 → "Visual" row |
| Test failure (assertion / timeout / locator) | `Error:` from a `*.spec.ts` | Continue Step 3 |
| Infra (artifact upload, gh-pages push) | Failure only in `merge-reports` or `publish-allure` | Usually permissions or first-run gh-pages — check the `permissions:` block. |

### Step 3 — Download artifacts (test failures)

```bash
gh run download <run-id> -n playwright-html-report -D /tmp/ci-<run-id>/html
gh run download <run-id> -n allure-results-1 -D /tmp/ci-<run-id>/allure-1
gh run download <run-id> -n allure-results-2 -D /tmp/ci-<run-id>/allure-2
```

Open the trace for each failed test:

```bash
npx playwright show-trace /tmp/ci-<run-id>/html/data/<trace-id>/trace.zip
```

(Or open `/tmp/ci-<run-id>/html/index.html` in a browser and click into the failed test.)

### Step 4 — Categorize root cause

| Category | Trace signature | Typical fix |
|----------|----------------|-------------|
| **Timing/race** | Action passed, assertion failed milliseconds later, or "element detached" | Use the page object's `expect…` helper that already waits, or add `await expect(locator).toBeVisible()` before action |
| **Locator drift** | "Locator resolved to N elements" or "not visible" on a stable element | Update the field on `src/pages/*.page.ts` or `src/components/*.component.ts`. Never patch in the spec. |
| **Auth / storageState** | `tests/ui-authed/*` failing with redirect to `/index.html` | `setup` project failed to write `playwright/.auth/standard-user.json`, or saucedemo creds rotated. Re-run setup; check `src/testdata/users.ts`. |
| **API flake** | `expect([404, 503]).toContain(...)` triggered the 503 branch in Booker tests | restful-booker free Heroku cold-start; already accounted for. If a different status, investigate. |
| **Visual** | `toHaveScreenshot()` mismatch | Compare diff in HTML report. If intentional UI change → run `npm run test:visual:update` locally (Docker), commit new baselines. If unintentional → real regression. |
| **App bug** | Reproducible against a fresh manual `npm run test:headed` | Not a test bug — file an issue, do not weaken the assertion. |
| **Flaky** | Passes on rerun with no code/env change | Step 5 |

### Step 5 — Confirm flakiness (only if suspected)

A test is "flaky" only after evidence.

```bash
npm run test:ui -- --grep "<title>" --repeat-each=5
```

- 5/5 pass → suspect shared CI state. Inspect trace timeline at the assertion point.
- 1+/5 fails → real bug, not flake.

Never add `test.retry()` or raise project `retries` to silence this. CI already retries 2x (`playwright.config.ts:9`); if it still fails, that's signal.

### Step 6 — Propose minimal fix

Show the user:

- **Failed test**: `<spec-file>:<test title>`
- **Category** from the table above
- **Root cause** in one sentence
- **Proposed fix**: a diff against the specific file (page object, component, fixture, or spec) — minimal, no surrounding refactor
- **How the fix will be verified**: which committed symbol the verification will exercise (defer to `self-verification-guardrail`)

Do not write the fix yet — wait for user approval, then execute through `research-first` → edit → verify.

## Permissions

Already in `.claude/settings.local.json`:

- `Bash(gh run *)` — fetch logs and artifacts
- `Bash(npx playwright *)` — open traces, rerun locally
- `Bash(npx allure *)` — inspect Allure results
- `Bash(npm run *)` — re-run suites locally

## Anti-Patterns

- **"Just rerun it"** — only acceptable for browser-install or upload-artifact failures. Never for test failures without root-cause first.
- **Adding `test.retry(2)` to a spec** — masks the bug. CI already retries.
- **Patching a locator inside the spec** — locators belong on the page/component object. Specs orchestrate, they do not select.
- **Reading only the last 50 lines of the log** — first failure usually scrolls off; always grab `--log-failed` to a file.
- **Updating visual baselines outside Docker** — produces non-portable snapshots that fail CI. Always use `npm run test:visual:update`.
