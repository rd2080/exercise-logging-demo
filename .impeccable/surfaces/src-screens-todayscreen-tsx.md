---
version: 1
slug: "src-screens-todayscreen-tsx"
primary_target: "src/screens/TodayScreen.tsx"
related_targets: []
---

# Tab bar and the Today and Exercises tabs (Operate)

Scope and mode: Operate. An extension of the established route-tape world (DESIGN.md). The main navigation for the three tabs a returning user lives in: Today, Exercises, Progress. Fixture data only.

Audience, job, task: someone who has finished set up and moves between today's workout, the list of exercises, and their progress. Chosen with the user: simple real screens for Today (today's workout, exercises, one Start workout button) and Exercises (a plain list with tracking type and target; no filters or search yet); the tab bar is hidden during the workout, set up, programme and reminders so nothing competes with logging and the pinned Log set button.

Approved sheet rows: row 34 bottom tab bar with our own tabs (Today, Exercises, Progress); row 33 side drawer dropped; one floating element at a time. Unresolved: tab icons are generic line icons (no authored set), the Exercises rows are not tappable yet (no detail page), no filters, search or live count.

## Direction contract

THESIS: Navigation is a strip of three tape slots along the bottom. The tab you are on is the lit one, marked the same way the current set and current goal are marked, so the app has one way of saying "you are here".

OWN-WORLD: Inherits DESIGN.md unchanged: warm near-black ground, ivory ink, Barlow Semi Condensed, one tape colour (yellow), hairline separators, flat tonal rows, no cards, no new colours or materials. Inactive tabs are muted ivory; the active tab is ivory with a 4px tape bar above its icon.

STORY: The user taps a tab, sees where they are, and reaches their workout, their exercise list or their progress in one tap, without the bar ever sitting on top of the workout itself.

FIRST VIEWPORT: Today: title "Today", a one-line summary of the workout, one inline Start workout button, then the exercises as hairline rows. A 64px tab bar pinned at the bottom with three equal tabs (icon over a sentence-case label).

FORM: Extension of an established surface (no structure roll): bottom tab bar and two list screens. seed: none (pinned) "Build the tab bar next", with the world pinned by DESIGN.md and the nav model by approved sheet row 34. The Start workout button sits inline, not pinned, because the tab bar is the one floating element on these screens. Signature move: none new; the tab marker reuses the current-item tape bar.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
