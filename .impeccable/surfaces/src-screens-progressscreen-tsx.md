---
version: 1
slug: "src-screens-progressscreen-tsx"
primary_target: "src/screens/ProgressScreen.tsx"
related_targets: []
---

# Progress screen: empty state and locked goals (Operate)

Scope and mode: Operate. An extension of the established route-tape world (DESIGN.md), not a new identity. The screen a new user sees before any history exists. Fixture data only.

Audience, job, task: a new user who has just finished set up and has logged nothing. They need to know where their sets will appear and what to do next, and to see goals worth aiming at. Content from the approved sheet rows: an empty-state template (image, headline, where data will appear, one main button) reusable for any page with nothing to show; locked goals shown as a visible goal list. Streaks and points are deferred until logging exists. No toasts, offers or decoration.

Assumptions made without a question round (the request was precise): the screen is reached at the end of the new-user flow and is the landing for a user with no history; its one main button starts the first workout; goals are authored fixtures (first set, a full session, hitting the plan, week one); the "image" is an authored illustration of empty tape slots, not a photo.

Unresolved: real goals and thresholds, real history, a tab bar for moving between Today, Exercises and Progress (approved in the sheet, not built).

## Direction contract

THESIS: A page with nothing on it is a roll of unused tape. It shows the empty slots your sets will fill, says so in one plain sentence, and gives one way to lay the first strip.

OWN-WORLD: Inherits DESIGN.md unchanged: warm near-black ground, ivory ink, Barlow Semi Condensed, grain tape cut on a slant, tape yellow as the only colour, flat tonal rows with hairlines, no cards, no new colours or materials. Locked goals are neutral slots with a lock mark; an unlocked goal is a tape-filled slot with a check.

STORY: The user sees a strip of empty slots, reads "Your sets will be logged here", taps Start your first workout, and has already seen four goals to work toward.

FIRST VIEWPORT: Title "Progress". An illustration of five empty tape slots with the first one marked as next. A headline, one sentence saying where sets will appear and what is shown, and the full-width main button "Start your first workout". Below, a short "Goals to unlock" list of four hairline-separated rows (lock slot, goal, requirement, count), partly visible so it invites scrolling.

FORM: Extension of an established surface (no structure roll), the template as one component and the goal list as another, both reusable. seed: none (pinned) "Build the empty-state template and locked goals list", with the world pinned by the existing DESIGN.md and the first-surface experience by the approved sheet rows for the empty state and locked goals
The one main button sits inline in the template, not pinned, because this page scrolls and a pinned button would cover the goal rows. Signature move: none new. When a goal unlocks, its slot takes the existing slanted tape wipe.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
