---
version: 1
slug: "src-screens-playerscreen-tsx"
primary_target: "src/screens/PlayerScreen.tsx"
related_targets: []
---

# Exercise player (Operate)

Scope and mode: Operate. One phone-width screen where a beginner or a skill-goal athlete logs sets during a workout. Fixture data only. Dark theme only.

Audience, job, task: logs a set in one tap, prefilled from the last session or the plan. Tracking types: reps, reps per side, time hold, weight and reps. Rules: no work timer for reps or reps per side; exercise name and one form cue above the inputs; button labels name the result in sentence case; a media slot (looping muted demo or start and end frames).

Unresolved: real exercise video, form-cue copy and photographs do not exist. The demo is an authored synthetic figure, labeled as such.

## Direction contract

THESIS: The session is a strip of gym route tape and every logged set is a tick on the send list. Logging is the one job, so the screen refuses anything that slows it, and refuses the category's neon-on-black fitness default.

OWN-WORLD: Warm near-black ground (brown-black, red above green in every surface), ivory text, workhorse condensed grotesk (Barlow family) with tabular numerals, 56px targets, pill-ended tape strips. Tape colour does one job: each tracking type owns a colour (reps yellow, reps per side orange, time hold sky blue, weight and reps pink). Logged tape keeps its colour, so the session strip reads as a send list; the current exercise's strip is tinted with its colour and fills as sets are logged, and exercises not yet started stay neutral. Tape is drawn as a material: fine fibre grain on the colour, strips cut square on a slant, a slanted leading edge on the wipe.

STORY: The user sees what to do and one cue, taps Log set, watches the tape laid, rests, and moves on. They never read instructions.

FIRST VIEWPORT: Top bar with close and "Exercise 2 of 4". Under it the whole session as four tape segments. A demo slot at about 2.3:1, narrowed from 4:3 so the name, cue, set slots, steppers and pinned button all fit in the first viewport at 390x844, with the figure scaled to fill the frame. The exercise name large, its tracking-type tag and target, one cue line. Then the sets as tape slots, the steppers prefilled with a source note, and a pinned "Log set" button in the exercise's tape colour.

FORM: Climbing-gym route tape, position 1 of 7 on my ordered list (my own top-ranked, picked by the user over the dealt direction), seed:d4fff46b3db2811c. Signature move: when a set is logged, a strip of tape rolls across its slot in about 200ms and the session strip fills.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
