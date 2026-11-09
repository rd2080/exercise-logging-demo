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
4. Build the screens with the design skill (frontend-design as the base; Impeccable if installed).
5. Compare a functional version against a better-looking, slightly more complex one, using screenshots in `screenshots/`.
6. When output is wrong, fix the prompt rather than patching code -> log in `docs/prompt-log.md`.

The tech stack is deliberately **undecided**. It will come from the skill recommendation (see `docs/decisions.md`).

## Layout

```
docs/
  decisions.md        open questions and decisions
  trend-map.md        Step 2 keep/change/drop/add table
  prompt-log.md       prompt fixes (Step 6)
  observations/       Step 1 output
  frames/             frames extracted from the video
fixtures/             fixture data (no live data)
tests/                Playwright checks (phone width)
screenshots/          functional/ vs polished/ comparison
```
