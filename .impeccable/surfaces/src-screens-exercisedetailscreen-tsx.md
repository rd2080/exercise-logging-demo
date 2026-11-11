---
version: 1
slug: "src-screens-exercisedetailscreen-tsx"
primary_target: "src/screens/ExerciseDetailScreen.tsx"
related_targets: []
---

# Exercise detail and edit entry (Operate)

Scope and mode: Operate. Extensions of the route-tape world (DESIGN.md), built by parallel agents and reviewed afterwards. The detail screen opens from the exercise rows and shows one exercise with its history; the edit sheet opens from an entry row on Progress.

Audience, job, task: someone who wants to see one exercise's target, cue and history and log a set for it, or fix or delete a set they logged. Rules kept: name and one form cue above inputs; one-tap logging prefilled; labels name the result; one floating element at a time; one tape colour per working area.

Unresolved: entries have no date or time; no way to clear all entries; hand-logged entries without an exercise id match history by name and type only.

## Direction contract

THESIS: One exercise, one page: what it is, how to do it, what you have done, and one button to add to it.
OWN-WORLD: Inherits DESIGN.md unchanged.
STORY: The user taps a row, reads the cue, taps Log a set, confirms the prefilled numbers and sees the history grow; or taps an entry to change or delete it with one in-place confirmation.
FIRST VIEWPORT: Back button, compact demo figure, name, type tag, target, cue, a 64px Log a set button, then the history under the tab bar.
FORM: Extension of an established surface (no structure roll). seed: none (pinned) "Yes, run the design review" after parallel builds of exercise detail and edit/delete entries, with the world pinned by DESIGN.md.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
