---
version: 1
slug: "src-screens-myprogrammescreen-tsx"
primary_target: "src/screens/MyProgrammeScreen.tsx"
related_targets: []
---

# Programme page and weekly dots (Operate)

Scope and mode: Operate. An extension of the route-tape world (DESIGN.md). A row on Today opens a page for the programme chosen in set up: status, this week's training days as dots, stats, stages and what you need. Progress comes from the user's real logged workouts.

Audience, job, task: someone following a programme who wants to know where they are and what is next. Approved sheet rows 58 to 60: programme detail with stats and tag chips, staged progress with completed counts, weekly day dots (streaks deferred). Chosen with the user: the entry is a row on Today; progress and dots come from real logged workouts (every saved set now has a date).

Assumptions made without asking: a session is a day with a workout-logged set since the programme started; weeks are Monday to Sunday in local time and week 1 is the week the programme was chosen; planned days are Monday/Wednesday/Friday for three a week and similar for other counts; stage names, weeks and focus lines are authored fixtures; stages follow completed sessions in order, so the approved "confirm before switching stage" popup (row 61) is not built because nothing switches stages by hand.

Unresolved: switching stage by hand, streaks and perfect week, rescheduling planned days, restarting or ending a programme.

## Direction contract

THESIS: A programme is a long strip of tape and a week is seven slots. You see how much is laid and which slot is next.
OWN-WORLD: Inherits DESIGN.md unchanged.
STORY: The user taps the programme row, sees this week's dots and stage progress, and taps Start workout.
FIRST VIEWPORT: Back button, name, status line, Start workout, then the weekly dots with "2 of 3 sessions this week" and the stats row.
FORM: Extension of an established surface (no structure roll). seed: none (pinned) "Build the programme page with weekly dots", with the world pinned by DESIGN.md and content by sheet rows 58 to 60 and the user's two answers.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
