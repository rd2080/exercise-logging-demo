---
version: 1
slug: "src-screens-exercisesscreen-tsx"
primary_target: "src/screens/ExercisesScreen.tsx"
related_targets: []
---

# Exercise library: search and filters (Operate)

Scope and mode: Operate. An extension of the route-tape world (DESIGN.md). The Exercises tab becomes the whole library with a live count, search, and filters in a bottom sheet. Fixture data only (fixtures/library.json, 19 authored exercises).

Audience, job, task: someone finding an exercise to read about or log. Approved sheet rows 26 to 32: chip filter groups, live result count, Reset and a Show-N button as text, a filter count badge, a list row with the equipment shown, a single list with search. Filter dimensions were chosen by me (tracking type, equipment, level) because those are the attributes an exercise has here; Nike's duration, intensity and format do not apply.

Assumptions made without asking: within a group any choice counts, across groups all must hold; search matches name, type, equipment and level; the library replaces the plan-only list on this tab (Today still shows the plan); exercises beyond the four with authored poses show "No demo for this exercise yet" in the media slot instead of a wrong figure.

Unresolved: real exercise content, real demos, filters in the URL, sort order, saved filters.

## Direction contract

THESIS: Finding an exercise is narrowing a strip of tape: every choice shortens the list and the count tells you by how much.
OWN-WORLD: Inherits DESIGN.md unchanged: solid ivory selected chips, outlined unselected chips, hairline rows, grain tape slots keyed by type, one yellow tape colour for the sheet's pinned button.
STORY: The user types or opens Filters, watches the count change, taps Show N, and taps a row to read and log.
FIRST VIEWPORT: Title, live count, a search field beside a Filters button, then the exercise rows with their type, target, equipment and level.
FORM: Extension of an established surface (no structure roll). seed: none (pinned) "Exercises filters and search (Recommended)", the user's choice among the remaining approved items, with the world pinned by DESIGN.md and the content by sheet rows 26 to 32.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
