---
version: 1
slug: "src-components-addexercisesheet-tsx"
primary_target: "src/components/AddExerciseSheet.tsx"
related_targets: []
---

# Manual entry: log an exercise by hand (Operate)

Scope and mode: Operate. An extension of the established route-tape world (DESIGN.md). A plus button on Progress opens a bottom sheet to log a set done outside a workout. Fixture/in-memory data only; entries live for the session and show on Progress.

Audience, job, task: someone who did an exercise outside the app and wants it recorded fast. Chosen with the user: the plus is an icon-only button at the top right of Progress (the approved exception to the button-label rule, sheet row 23) plus a text button "Log an exercise" in the empty state; the flow is "pick, then log": choose an exercise from the plan (or "Something else" with a name and a tracking type), then the same one-tap steppers prefilled from last time, and "Log set" saves it. Rules kept: steppers and tracking types follow the player's rules (no work timer for reps or reps per side; no timer at all in manual entry); button labels name the result in sentence case; one tap logs, prefilled from the last entry of that exercise, then the last session or plan, then a stated default; one floating element at a time (the sheet is the only layer while open).

Assumptions made without asking: entries are in memory only, most recent first, shown on Progress with "Added by hand"; the first logged entry unlocks the "First set" goal; plan exercises show the demo figure and form cue above the inputs, but a custom exercise has no demo media and no form cue, so those two rules cannot apply to it (stated in the sheet, not faked).

Unresolved: persistence, editing or deleting an entry, date and time of the entry, notes.

## Direction contract

THESIS: A manual entry is a strip of tape laid by hand. It uses the player's own inputs and the same slanted wipe, so logging outside a workout feels like logging inside one.

OWN-WORLD: Inherits DESIGN.md unchanged: warm near-black ground, ivory ink, Barlow Semi Condensed, grain tape cut on a slant, hairline rows, no cards, the sheet pattern from set up. No new colours or materials.

STORY: The user taps the plus, picks what they did, confirms the prefilled numbers, taps Log set, and sees the new row on Progress.

FIRST VIEWPORT: Progress with a 48px plus button beside the title. The sheet: a title, a one-line why, then a list of the plan's exercises (name, type) and a last row "Something else". Second step: demo figure, exercise name, type tag, cue, the steppers with the source note, and a pinned "Log set" button.

FORM: Extension of an established surface (no structure roll). seed: none (pinned) "Build the plus button for manual entry", with the world pinned by DESIGN.md, the entry points by approved sheet rows 23 and 76, and the placement and flow by the user's two answers. Signature move: none new; the logged row takes the existing 150ms tape wipe.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
