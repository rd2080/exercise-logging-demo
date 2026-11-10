---
version: 1
slug: "src-screens-setupscreen-tsx"
primary_target: "src/screens/SetupScreen.tsx"
related_targets: []
---

# New-user flow: set up a plan (Operate)

Scope and mode: Operate. The first-run flow for a new user, on the same dark route-tape world as the exercise player (DESIGN.md). Fixture data only. Three screens: set up (four answers on one screen), choose a programme, reminders, then the player.

Audience, job, task: a beginner or a skill-goal athlete answering four questions once, fast, on a phone. Answers: goals (up to three, ranked by pick order), activity level (single choice), equipment (None first and exclusive; a Pull-up bar follow-up with safe defaults off and the consequence stated in place), limits (optional toggles: train quietly, limited space, no running). Rules from the sheet: one screen of questions instead of one screen per question; a why-we-ask line per question; time estimate shown; the main button is disabled until the required answers exist and names the result ("Create my plan"); neutral greeting; no birth date, no consent wall, no testimonials, no fake plan-building animation, no account step. Unresolved: real programme content (authored fixtures: Handstand push-up 8 weeks, Foundation strength 4 weeks); real equipment photos (authored line icons instead).

## Direction contract

THESIS: Setup is four slots of tape to fill. Each answered question lays tape on its slot, and the programme you pick is a strip as long as its weeks.

OWN-WORLD: Inherits DESIGN.md unchanged: warm near-black ground, ivory ink, Barlow Semi Condensed numerals, grain-textured tape cut on a slant, one tape colour at a time (yellow here), 56px targets, sentence-case result-naming buttons. Sheets and rows are flat and tonal, no new colours or materials.

STORY: The user sees four rows and what each is for, answers each in a sheet, sees the rows fill with tape, taps Create my plan, picks a programme sized by its tape strip, and lands in the player with nothing to read.

FIRST VIEWPORT: Title "Set up your plan" and a one-line time estimate. Four tappable rows (Goal, Activity level, Equipment, Limits), each with a slot badge at the left, the question, its why-we-ask line in muted text and the current answer or "Choose" with a chevron at the right. Above the pinned "Create my plan" button, a line naming what is still needed. No header chrome, no close button.

FORM: Summary rows that open bottom sheets, position 4 on my ordered list of 7 (dealt lead of the surface roll, picked by the user), seed:6da962f31fe52449. Signature move: the slot badge fills with a grain tape strip on a slanted leading edge (about 220ms) when its row is answered; the programme rows show their length as a strip of weekly tape segments.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
