---
name: Exercise Player
description: A dark, warm-black set logger where every tracking type owns a strip of gym route tape.
colors:
  ground: "#161412"
  surface: "#1d1b18"
  surface-2: "#292622"
  line: "#3f3a33"
  ink: "#f2f1ea"
  muted: "#b1ada1"
  on-tape: "#14150f"
  tape-reps: "#f5c518"
  tape-side: "#ff8a3d"
  tape-time: "#5bb8ff"
  tape-weight: "#ff6fb1"
typography:
  display:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "72px"
    fontWeight: 700
    lineHeight: 1
  headline:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1.05
  title:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.4
  numeral:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "12px"
  md: "16px"
  lg: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.tape-reps}"
    textColor: "{colors.on-tape}"
    rounded: "{rounded.full}"
    height: "64px"
  button-secondary:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "56px"
  button-icon-close:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: "48px"
  stepper-button:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "56px"
    width: "56px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  set-slot-empty:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    height: "56px"
  set-slot-logged:
    backgroundColor: "{colors.tape-reps}"
    textColor: "{colors.on-tape}"
    rounded: "{rounded.md}"
    height: "56px"
  type-tag:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
---

# Design System: Exercise Player

## Overview

**Creative North Star: "The Route Tape"**

The session is a strip of gym route tape and every logged set is a tick on the send list. The screen is a warm brown-black wall (red sits above green in every surface) with ivory text and one workhorse condensed grotesk. Colour is not decoration: each tracking type owns one tape colour, and that colour is the only saturated thing on screen. Logging is the one job, so everything else is quiet, large and close to the thumb.

Density is low and targets are big (48 to 64px). Depth is tonal, not lifted. The single signature gesture is the tape roll: when a set is logged, a strip of grain-textured tape sweeps across its slot on a slanted leading edge in about 150ms and the session strip fills.

**Key Characteristics:**
- Dark only, warm near-black, ivory ink, no pure black or white.
- One saturated hue at a time, set per screen through the `--tape` variable.
- Tape is a material: fine horizontal fibre grain over the colour, never a flat fill.
- Condensed display face with tabular numerals for everything the user reads mid-set.
- 56px minimum control height, 64px pinned primary button.

## Colors

A brown-black ground and three warm surface steps, with four tape colours that each map to exactly one tracking type.

### Primary
- **Reps Yellow Tape** (#f5c518): reps exercises, and the default `--tape` before any exercise sets it. Fills the pinned button, logged slots, focus ring, selection tint.
- **Side Orange Tape** (#ff8a3d): reps per side.
- **Hold Sky Tape** (#5bb8ff): timed holds.
- **Weight Pink Tape** (#ff6fb1): weight and reps.

### Neutral
- **Gym Wall Black** (#161412): page ground and the pinned footer.
- **Chalkboard Brown** (#1d1b18): cards, demo frame, the input and rest panels.
- **Worn Mat Brown** (#292622): buttons, empty set slots, tags, unfilled session segments.
- **Seam Brown** (#3f3a33): hairline borders, scrollbars, the divider in the reduced-motion demo.
- **Chalk Ivory** (#f2f1ea): primary text and the demo figure's limbs.
- **Dust Grey** (#b1ada1): secondary text, captions, empty slot numbers.
- **Tape Ink** (#14150f): text laid on any tape colour.

### Named Rules
**The One Tape Rule.** A screen shows one exercise's tape colour at a time through `--tape`. Other tape colours appear only as completed or pending segments in the session strip, in the summary of logged sets, and as the tracking-type key on the Exercises list. Today's rows stay neutral because the Start workout button already owns the tape colour there. Components read `var(--tape)`; they never hard-code a tape hex.

**The Tape Ink Rule.** Text on tape is always Tape Ink (#14150f), never ivory or black.

**The Warm Neutral Rule.** Every neutral leans brown (red channel above blue). No cool grey, no pure #000 or #fff.

## Typography

**Display Font:** Barlow Semi Condensed (with Barlow, system-ui, sans-serif)
**Body Font:** Barlow (with system-ui, sans-serif)

**Character:** A gym-signage grotesk: the semi-condensed cut carries headings and every number, regular Barlow carries sentences. Numerals are tabular (`.num`) so values do not jitter as they change.

### Hierarchy
- **Display** (700, 72px, 1): the hold countdown only.
- **Numeral** (700, 44px, 1, tabular): stepper readouts and the rest countdown.
- **Headline** (700, 36px, 1.05, balanced wrap): exercise name; the summary title steps up to 40px.
- **Title** (600, 24px): panel headings (Rest, Hold, All sets logged) and summary exercise names.
- **Body** (400, 17px, 1.4): target text, tag text (semibold), the form cue at 18px capped at 34ch.
- **Label** (500, 15px): stepper labels and the prefill note; the demo caption is 14px.
- **Set value** (700, 20px, tabular): the values printed on logged tape.

### Named Rules
**The Tabular Number Rule.** Any value that changes or is compared (reps, kg, seconds, clock, set index) uses the `.num` class.

**The Sentence Case Rule.** All labels and button text are sentence case and name the result ("Log set", "Next exercise"). There is no uppercase styling anywhere in the build.

## Layout

A single phone column: full width up to a 480px centered max, 16px side gutters, 16px vertical gap between main blocks. Order from top: header (close button and "Exercise N of M", then the session strip), demo frame, exercise block (name, tag and target, cue), set slots, then the one active panel (inputs, rest, hold or done). The primary button is pinned to the bottom, and main carries 160px bottom padding to clear it. Under 700px tall (the `short` variant) the demo frame drops to 240:68, the heading to 30px, the cue to 16px, steppers to 48px buttons and a 36px value, and the footer button to 56px so the logged value and its source note stay above it. Safe-area insets are honoured top and bottom. Spacing is a 4px base used at 4, 8, 12, 16, 24. Paired steppers split the row 50/50 with a 16px gap.

## Elevation & Depth

Flat and tonal. There are no drop shadows. Depth comes from the step ground, surface, surface-2, plus a 1px Seam Brown top border on the pinned footer. The only non-tonal emphasis is the tape-colour marker on the current item: a 4px bar along the bottom of the current set slot, and a short bar under the current segment of the session strip. State feedback is motion: pressed controls scale to 0.97, hovered controls brighten 8% (hover-capable devices only).

## Shapes

Soft-cornered slabs with pill-ended primaries. Radii: 24px for cards and the demo frame, 16px for buttons and steppers, full pill for the primary button, close button, tag and rest bar, 12px for the focus outline. Tape is the exception: session segments (7px ends) and set slots and summary chips (10px ends) are clipped to parallelograms (`tape-cut`) with a 4px gap so neighbours interlock. Session segments are 12px tall. The tape-roll wipe uses a slanted leading edge, and the grain tile is a 160 by 96px fractal-noise SVG at 55% opacity.

## Components

### Buttons
- **Primary:** pinned, full width, 64px tall, pill, tape colour fill with Tape Ink 20px bold text. One per screen. The label changes with phase: Log set, Skip rest, End hold, Next exercise, Finish workout. On the summary it is ivory (#f2f1ea) fill with Tape Ink text.
- **Secondary:** Worn Mat Brown, 16px radius, 56px (Start hold) or 48px (Add 15 seconds) tall, 18px semibold ivory text.
- **Icon close:** 48px circle, Worn Mat Brown, 24px lucide X at 2.5 stroke.
- **States:** all use `.press` (160ms ease-out-expo; scale 0.97 on active; brightness 1.08 on hover). Reduced motion removes the transition and transform. Focus is a 3px outline in the tape colour, 3px offset.

### Stepper
Label above (15px muted), 44px tabular readout, minus and plus as 56px Worn Mat Brown squares. Full width variant puts the readout between the buttons; compact variant stacks readout over two flex buttons so two fit side by side. Buttons disable at min and max. Weight steps 2.5, hold time 5, reps 1.

### Set slots
A grid of 56px slots (48px on short phones) that shows the value in a short form (for example 12/15, 285s, 142.5×12). Slots have a per-type minimum width and wrap to a second row instead of clipping. They are cut on a 10px slant with a 4px gap. Empty: Worn Mat Brown with the set number in muted. Current: the number in the tape colour plus a 4px tape bar along the bottom. Logged: grain tape fill with the value in Tape Ink, revealed by the slanted clip-path wipe (150ms, ease-out-expo; instant under reduced motion).

### Session strip (signature)
One parallelogram segment per exercise. Unstarted: Worn Mat Brown. Current: Seam Brown (one step lighter than unstarted) with a short 4px tape-colour bar under it. Fill is a grain tape bar scaled on X (150ms) to logged over total sets, in that exercise's own colour, so logged tape keeps its colour.

### Cards / Containers
24px radius, Chalkboard Brown, 16px padding, 16px internal gap, no border or shadow. Used for the input panel, rest panel, hold panel and done panel. The rest bar inside is an 8px pill track whose tape fill drains with one linear scaleX animation (no per-frame updates).

### Tab bar
Three equal tabs (Today, Exercises, Progress), pinned to the bottom, 64px tall plus the safe-area inset, on the ground colour with a Seam Brown top hairline. Each tab is an icon over a 15px semibold sentence-case label. Inactive tabs are muted ivory. The current tab is ivory with a 48 by 4px grain tape marker on its top edge, cut on a 4px slant and laid with the standard 150ms wipe when the tab changes (instant under reduced motion). It is the same "you are here" marker as the 4px grain bars on the current set slot, the current segment of the session strip and the first locked goal. Tapping the current tab scrolls the page to the top. The bar shows only on Today, Exercises and Progress and is hidden in the player, set up, programmes and reminders. On those three screens it is the one floating element, so a main button on them is inline, not pinned, and the page carries 112px of bottom padding to clear the bar.

### Exercise row
Flat row with hairline separators: a small slanted slot (neutral on Today, in the tracking-type colour on the Exercises list as a key), a 20px semibold name (two lines at most on Today, full on Exercises), and a muted line with the type and a compact target such as `Reps · 3 × 10`. Tappable rows (the Exercises and Today lists, and the entries on Progress) end in a muted chevron; read-only rows have none.

### Known gaps
Set up has no back button: a user who reaches it from an empty tab can only finish it, which returns them to Progress with the tab bar. Entries carry a date and time, but older saved entries do not. Stages follow the sessions you finish unless the user moves on early (see Confirm sheet).

### Plus button and manual entry
An icon-only 48px circle (Worn Mat Brown, ivory plus) at the right of the Progress title, labelled "Log an exercise" for screen readers. It is the one approved exception to the result-named-button rule. The empty state also carries a quiet text button, "Log an exercise", under its main button. Both open a bottom sheet in three steps: pick an exercise (the plan's exercises plus "Something else"), optionally name a new exercise and choose how it is counted, then log it with the player's own steppers, prefilled and with a source note. Plan exercises show the compact demo figure and the form cue above the inputs; a new exercise has neither, and the sheet says so. The pinned button is "Set amounts" while naming, then "Log set". A logged entry becomes an entry row on Progress under the heading "Logged sets" (tape check slot, name, the type with " · By hand" only for hand-logged entries, the values on the right with sides labelled L and R, and a chevron because the row opens the edit sheet), newest first. If the browser refuses to save, a muted line under the list says "Not saved on this device. Your entries will be lost when you close this page." The pick step uses plain buttons with a chevron, because tapping one moves on. In the log step the sheet carries the exercise's tracking-type colour (pinned button, focus ring, type tag, demo figure), so one tape colour shows at a time. Focus moves to the step title on each step, Enter on the name field advances, and a double tap logs once.

### Exercise library, search and filters
The Exercises tab lists the whole library: "N exercises" (or "N of M" when searching or filtering, announced politely), a 56px search field with a clear button, and a 56px "Filters" button that carries a count badge (ivory pill, Tape Ink number) when choices are active. Rows are the exercise rows with a keyed type slot, name, "Type · sets × amount" and a third muted line "Equipment · Level", and a chevron. Filters open the standard bottom sheet: groups for how it is counted, equipment and level, each a wrapping set of 48px pill chips (selected is solid ivory with Tape Ink text, unselected is a 2px Seam outline, `aria-pressed`). Within a group any choice counts; across groups all must hold. The pinned button is the live result, "Show 6 exercises", and reads "No exercises match" (disabled) at zero. "Reset" (the one allowed non-result label) sits at the right of the sheet title, outside the scrolling area, filled when it can act and faded when it cannot; it clears the filters and keeps the search text. Under the count, a grain tape strip shows the share of the library still listed and shortens as the list narrows (150ms). It is always the default tape colour (yellow) even when the rows below are keyed in other colours, and it is hidden at zero results so two tape devices never stack. With no matches the page shows the empty-state template with "Show all N exercises". Under 360px the search field and the Filters button stack so the field keeps its width. An exercise with no demo figure shows a plain frame saying "No demo for this exercise yet" in the media slot.

### Programme page and weekly dots
Today carries one hairline-bordered row with no label above it: the name, "Week 3 of 4" (or "Programme finished"), and a chevron; with no programme chosen it reads "Choose a programme" over "Weeks, stages and training days" and leads to set up. The row opens the programme page with Today still marked in the tab bar. Top to bottom: a 48px back button, the name (36px), the status line ("Week 3 of 4 · Stage 2: Build"), one inline 64px "Start workout", "This week" with the weekly dots, a three-part stats row (weeks, sessions a week, level) separated by hairlines rather than cards, "Stages", "What you need" with read-only tag pills, and a quiet text button "Choose a different programme".
Weekly dots are seven slanted slots, Monday to Sunday, labelled Mo to Su. A day with a finished workout is grain tape with a Tape Ink check; a planned day still to come is an ivory label on the neutral slot; a planned day that passed with no workout is a muted, underlined label; a rest day is a muted label. Today carries a 4px grain bar in its own row under the slot, so it shows whether or not today is done. Planned days come from the sessions per week (3 a week is Monday, Wednesday, Friday).
Stages list each stage with "done of size" and a strip of tape segments, one per session, filled in order; the current stage is the first one with sessions left, shown with a "Current stage" pill, and the status line names the same stage. Under 360px the level moves to its own row under the other two stats. A session is a day with at least one set logged in a workout since the programme started; hand-logged sets and undated older sets do not count. Weeks run Monday to Sunday in local time and week 1 is the week the programme was chosen. No streaks or points yet.

### Exercise detail
Opened by tapping an exercise row; the tab bar stays and the tab you came from is marked. Top to bottom: a 48px back button, the compact demo figure, the name (36px, wraps), the type tag pill, the target (17px muted), the form cue (18px), one inline 64px "Log a set" button, then "Your history". History rows lead with the values and show "Type · By hand" because the page already names the exercise; they are read-only, so no chevron. "No sets logged yet" when empty. An unknown exercise shows the empty-state template with "Back to exercises". "Log a set" opens the log sheet already on that exercise: the title, the cue, the prefilled steppers and the source note, with no figure, type tag or "Change exercise" (the page behind carries them).

### Edit sheet
Tapping an entry on Progress opens the sheet in the entry's tracking-type colour: title, the player's steppers, "Save changes" pinned. "Delete entry" (outlined) asks in place: "Delete this entry?" with "Delete entry" (outlined) and "Keep entry" (ivory, focused first). While asking, the pinned "Save changes" is hidden so there is one decision at a time.

### End workout and summary
The X in the player ends at once with no sets logged. With sets logged it replaces the pinned footer in place with "End workout?", a 64px "Keep going" in the tape colour (focused; Escape does the same) and a 48px 16px-radius "End workout". Focus returns to the X on Keep going and the page gains bottom padding so nothing hides behind the taller footer. The summary heading is "Workout logged" when at least one set was logged and "No sets logged" otherwise; the empty version shows only "Nothing was saved." and "Back to today". The logged version counts exercises that have logged sets and lists the tape slots.

### Empty state (template)
For any page with nothing to show yet: an authored illustration (five empty parallelogram slots in Worn Mat Brown with a short grain tape tail entering the first), a 36px bold headline, one sentence in muted text saying where the data will appear, and one full-width 64px pill in the tape colour that names the result. It is the one place the main button sits inline instead of pinned, because the page scrolls and a pinned button would cover the content below.

### Goal list
Flat rows separated by Seam Brown hairlines, no cards, 72px minimum. Each row: a slanted slot (a lock in muted while locked, grain tape with a Tape Ink check once unlocked, laid with the standard wipe), a 20px semibold title, a muted requirement line, and a segmented grain strip only for goals with more than one step. A 4px tape bar under the first locked goal's slot marks the next goal to reach.

### Type tag
Pill in Worn Mat Brown with a 12px tape-colour dot and the type name in 17px semibold, followed by the muted target text.

### Demo frame
Chalkboard Brown 24px-radius figure at 240:104 (240:68 on phones under 700px tall). A synthetic stick figure in ivory limbs on a tape-coloured floor line, looping a start and end pose; a "Demo figure" caption labels it as authored. Reduced motion shows two still frames (start, end) split by a 1px Seam Brown gap.

## Do's and Don'ts

### Do:
- **Do** drive every accent from `--tape` set on the screen root from the exercise's tracking type.
- **Do** lay text on tape in Tape Ink (#14150f) and give tape surfaces the grain fill, not a flat colour.
- **Do** keep controls at 48px or taller, the primary at 64px, and pin it to the bottom.
- **Do** use `.num` for every number and sentence-case labels that name the result.
- **Do** keep depth tonal (ground, surface, surface-2) and mark the current item with a tape-colour bar.
- **Do** honour reduced motion: no scale, no wipe, still start and end demo frames.

### Don't:
- **Don't** introduce a fifth saturated hue or put two tape colours in the working area at once.
- **Don't** use cool greys, pure black or pure white.
- **Don't** use drop shadows or glows to lift surfaces.
- **Don't** show a work timer for reps or reps per side; countdowns belong only to rest and timed holds.
- **Don't** add promotion, decoration or interruptions during an exercise.

### Streak and moving to the next stage
Under the weekly dots, one line: "3 weeks in a row with a session" (weeks with at least one finished workout; a quiet week so far does not break it, a missed full week does), or "No streak yet. Log a workout this week to start one." Before "What you need", when a later stage exists, "Ready to move on?" names the next stage and says the sessions left in this one count as done, with a "Move to stage 2" button that opens the Confirm sheet. The credit is saved as `skipped` in `exercise-demo:programme` (validated on read, optional, 1 to 1000). The last stage shows no move on.

### Confirm sheet
A short bottom sheet over the page for one yes-or-no question: the question as the title ("Switch to stage 2?"), one sentence of consequence, then two buttons that name the result in sentence case. Used for the stage move, "Clear all entries" (bottom of Progress, only with entries) and "Restart programme" (bottom of the programme page; week 1 starts again today, logged sets stay). The overlay covers the tab bar, so only one floating element shows.
- **Safe choice first for data loss.** With `destructive`, "Cancel" is the filled 64px tape button, shown on top and focused when the sheet opens, and the action is an outlined 56px button under it. The stage move is not destructive to data, so it keeps the filled tape action on top and a quiet "Cancel".
- **Stray-tap guard.** The action button ignores taps for 600ms after the sheet opens, so a double tap on the trigger cannot confirm. It looks the same while waiting.
- **Focus.** Focus moves to "Cancel" on open and returns to the trigger on close; if the trigger is gone (the entries are cleared, the stage section disappears) it goes to the page heading.

### Today session facts
Under the "N exercises, M sets" heading, one muted line: "About 19 min · Works chest, shoulders, triceps and quads · Needs dumbbells". Length is a rough estimate (45 seconds of work per set plus the rest between sets), muscles are the first four distinct ones from the placeholder `muscles` field in the fixtures, equipment lists what the session needs or says "No equipment". Only the minutes use the numeral face; the sentence stays in the body face.

### Set-up extras
Three plain additions to set up. A lead-in line (20px semibold, ink) sits between the sheet title and its muted reason on Activity, Equipment and Limits only, where it adds meaning; Goals has none. Two optional rows follow Limits and show "Add" in tape colour until answered: "Training style" (tap styles in order of preference, numbered on the tape slots; a ranking changes which programme is recommended and the reason says so) and "Weight and height" (text fields with a kg/lb and a cm/ft toggle in a radio group; values are checked against 20 to 300 kg and 100 to 250 cm, stored in kg and cm, never sent anywhere; the unit choice is remembered in `exercise-demo:units`). Creating the plan does not need either. The weight and height fields keep the last good value in kg and cm and show it again when the unit changes, so switching never drifts; pasted text is cleaned to digits and one decimal point, inches go from 0 to 11, and the error line is a polite live region in ink semibold. On a short screen (keyboard open) the lead and reason of this sheet are hidden visually so the fields stay in view. The unit toggles are two pressed-state buttons, not a radio group. A first goal of learning a skill still wins over the style ranking.

### Limits and equipment follow-ups
The limits chosen in set up ("Train quietly", "Limited space", "No running or sprints") are remembered in `exercise-demo:limits` (validated on read, unknown ids dropped). On the Exercises tab, exercises whose placeholder `demands` tag clashes with a limit are hidden, and one muted line under the title names the limits ("Hiding 5 that clash with train quietly and limited space.", announced politely) with a 48px underlined "Show them" / "Hide them" toggle; the count and strip follow what is shown. If every exercise clashes the page says "Nothing fits your limits" with "Show them" and "Change my limits" (the note is not repeated). A search that only finds hidden exercises says "Hidden by your limits" with "Show them". Changing limits means going through set up again; a follow-up answer resets when its equipment is removed. The Today workout and the add-exercise picker are not filtered.
In the equipment sheet, choosing Dumbbells or Resistance band opens a short follow-up block under the list, the same shape as the pull-up bar one: a heading ("About your dumbbells"), a one-line consequence that updates in place (announced politely), and one switch that starts off ("I have a pair heavier than 10 kg each", "I can anchor the band to a door or a post"). They change the wording of the consequence only (as the pull-up bar ones do); nothing in the plan or the list is filtered by them yet, so the lines are a prototype convention, not a promise the app keeps.

### Category, saved and thumbnails on the library list
Each library row's last line reads "Push · Bodyweight · Beginner" (category from the placeholder `category` field). The filter sheet gains "Saved" ("Saved only") and "Category" chip groups above Equipment; both count in the badge. A bookmark icon button (48px circle, pressed state, "Save exercise" / "Remove from saved") sits opposite Back on the exercise detail screen. Tapping it shows a pill toast at the top of the screen for about two seconds ("Saved to your exercises" / "Removed from saved"), announced politely and never shown on opening the screen; the top is used so it does not meet the tab bar. Saved ids are kept in `exercise-demo:saved` (validated on read) and saved rows show a small bookmark after the name. Rows end with a 64 by 56 tile: the drawn start frame where one exists (4 exercises), otherwise a placeholder tile with the category word, until real thumbnails exist.
