# Exercise Logging Demo

A local-only demo for redesigning the exercise pages: a standardised new-user (NUX) experience, friendlier exercise logging, and better usability and look.

## Objectives

1. A standardised new-user (NUX) page for exercises, with testing.
2. A more user-friendly exercise and logging experience.
3. Better usability and look across the app, for a higher-quality project.

Scope for now: **exercise pages only**. The rest of the app is evaluated afterwards.

## Rules

### Local only
- **Local first, deploy later.** Nothing here is deployed.
- **Fixture data only.** Use files in `fixtures/`. Agents never write test data to the live database, and no live credentials belong in this repo.
- **Phone width first.** Playwright checks run at phone width.

### Environments (dev / staging / prod)

| Env | Purpose | Status |
|---|---|---|
| dev | Local work and experiments, fixture data | **Only environment in use** |
| staging | Production-like rehearsal before release | Not set up. Deploy only after the demo is reviewed |
| prod | Live app and live database | Out of bounds. Nothing here touches it |

Changes move dev -> staging -> prod, never skipping a step.

## Approach

1. One-shot analysis of the Nike Training Club video (frames only, no audio). Find all trends, with frame evidence -> `docs/observations/`.
2. Map each trend to keep / change / drop / add and review the table -> `docs/trend-map.md`.
3. Apply the tracking-type text rules as context, after the observations.
4. Build the screens using the stack from the reel (`docs/observations/reel-design-stack.md`): three design skills (Emil Kowalski's design skills, Impeccable, Taste) and two tools (Figma MCP, Playwright). Review the result in phone-width Playwright screenshots in `screenshots/`.
5. When output is wrong, fix the prompt rather than patching code -> log in `docs/prompt-log.md`.

Stack: React, Vite, TypeScript, Tailwind and Motion. Open questions and decisions are in `docs/decisions.md`.

## Run it

Needs Node >=22.

```
npm install
npm run dev     # start the dev server, then open the address it prints on a phone-sized window
npx playwright install chromium   # once, before the first test run
npm test        # Playwright tests (starts its own server)
```

On a laptop, open the browser's device toolbar at 390 x 844. The row of buttons at the top of the page (demo, worst, empty, one, huge) is a dev-only data switch and is not part of the app.

## Screens and URL stages

Open a screen directly with `?stage=`:
- `setup`
- `programme`
- `reminders`
- `today`
- `exercises`
- `progress`
- `player`
- `exercise` (add `&id=push-up`)
- `myprogramme`
- `routine` (the warm-up flow)
- `skillgoal`
- `achievements`

## Dev data modes

`?data=worst|empty|one|huge` swaps in test data to stress the screens. Dev only. Fixtures are in `fixtures/` and `fixtures/worst/`.

## Saved data

Entries you log by hand are stored in the browser's localStorage under `exercise-demo:entries`. Nothing is sent anywhere.

## Tests

Playwright at phone width (390x844). Specs are in `tests/`.

`tests/a11y.spec.ts` runs axe (WCAG 2.2 AA, including colour contrast) on every screen and the main sheets at 390 and 320 px wide, checks that reduced motion stops animation, and asserts the muted-text contrast ratio. The dev data toggle is excluded.

## Design skills (Claude Code)

Installed in `.claude/skills/` so every session on this repo has them:
- `impeccable` plus its agents and a design-check hook (`.claude/settings.json`). The hook scans UI files after each edit and again when Claude finishes. It runs a checksum-verified engine binary downloaded from the project's GitHub releases.
- `taste-skill` (design-taste-frontend). Aimed at marketing sites, so use it with care on app screens. Its large photo, object, scene and moment assets are not committed (see `.gitignore`).
- Emil Kowalski's web skills: `emil-design-eng`, `animate`, `animation-performance`, `choreograph`, `gestures`, `mobile-native`, `review-animations`, `improve-animations`, `break-ui`, `ask-sonner`, `apple-design`. The React Native, Swift, prototype and library-picker skills were left out.

Check a page by hand: `.claude/skills/impeccable/scripts/impeccable detect <file-or-url>` (exit code 2 means findings).

## Layout

```
src/                  app code (App.tsx, screens/, components/, lib/, data/)
public/               static assets
docs/
  decisions.md        open questions and decisions
  trend-map.md        Step 2 keep/change/drop/add table
  prompt-log.md       prompt fixes (Step 6)
  observations/       Step 1 output
  frames*/            frames extracted from the videos
DESIGN.md, PRODUCT.md design and product notes
fixtures/             fixture data (no live data), worst/ for edge cases
tests/                Playwright checks (phone width)
screenshots/          Playwright phone-width screenshots for review
```
