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

Density is low and targets are big (48 to 64px). Depth is tonal, not lifted. The single signature gesture is the tape roll: when a set is logged, a strip of grain-textured tape sweeps across its slot on a slanted leading edge in about 220ms and the session strip fills.

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
**The One Tape Rule.** A screen shows one exercise's tape colour at a time through `--tape`. Other tape colours appear only as completed or pending segments in the session strip. Components read `var(--tape)`; they never hard-code a tape hex.

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

**The Sentence Case Rule.** All labels and button text are sentence case and name the result ("Log set", "Go to push-up"). There is no uppercase styling anywhere in the build.

## Layout

A single phone column: full width up to a 480px centered max, 16px side gutters, 16px vertical gap between main blocks. Order from top: header (close button and "Exercise N of M", then the session strip), demo frame, exercise block (name, tag and target, cue), set slots, then the one active panel (inputs, rest, hold or done). The primary button is pinned to the bottom, and main carries 160px bottom padding to clear it. Under 700px tall (the `short` variant) the demo frame drops to 240:68, the heading to 30px, the cue to 16px, steppers to 48px buttons and a 36px value, and the footer button to 56px so the logged value and its source note stay above it. Safe-area insets are honoured top and bottom. Spacing is a 4px base used at 4, 8, 12, 16, 24. Paired steppers split the row 50/50 with a 16px gap.

## Elevation & Depth

Flat and tonal. There are no drop shadows. Depth comes from the step ground, surface, surface-2, plus a 1px Seam Brown top border on the pinned footer. The only non-tonal emphasis is the tape-colour marker on the current item: a 4px bar along the bottom of the current set slot, and a short bar under the current segment of the session strip. State feedback is motion: pressed controls scale to 0.97, hovered controls brighten 8% (hover-capable devices only).

## Shapes

Soft-cornered slabs with pill-ended primaries. Radii: 24px for cards and the demo frame, 16px for buttons and steppers, full pill for the primary button, close button, tag and rest bar, 12px for the focus outline. Tape is the exception: session segments (7px ends) and set slots and summary chips (10px ends) are clipped to parallelograms (`tape-cut`) with a 4px gap so neighbours interlock. Session segments are 12px tall. The tape-roll wipe uses a slanted leading edge, and the grain tile is a 160 by 96px fractal-noise SVG at 55% opacity.

## Components

### Buttons
- **Primary:** pinned, full width, 64px tall, pill, tape colour fill with Tape Ink 20px bold text. One per screen. The label changes with phase: Log set, Skip rest, End hold, Go to [next exercise], Finish workout. On the summary it is ivory (#f2f1ea) fill with Tape Ink text.
- **Secondary:** Worn Mat Brown, 16px radius, 56px (Start hold) or 48px (Add 15 seconds) tall, 18px semibold ivory text.
- **Icon close:** 48px circle, Worn Mat Brown, 24px lucide X at 2.5 stroke.
- **States:** all use `.press` (160ms ease-out-expo; scale 0.97 on active; brightness 1.08 on hover). Reduced motion removes the transition and transform. Focus is a 3px outline in the tape colour, 3px offset.

### Stepper
Label above (15px muted), 44px tabular readout, minus and plus as 56px Worn Mat Brown squares. Full width variant puts the readout between the buttons; compact variant stacks readout over two flex buttons so two fit side by side. Buttons disable at min and max. Weight steps 2.5, hold time 5, reps 1.

### Set slots
A row of 56px slots (48px on short phones), equal flex, cut on a 10px slant with a 4px gap. Empty: Worn Mat Brown with the set number in muted. Current: the number in the tape colour plus a 4px tape bar along the bottom. Logged: grain tape fill with the value in Tape Ink, revealed by the slanted clip-path wipe (220ms, ease-out-expo; instant under reduced motion).

### Session strip (signature)
One parallelogram segment per exercise. Unstarted: Worn Mat Brown. Current: Seam Brown (one step lighter than unstarted) with a short 4px tape-colour bar under it. Fill is a grain tape bar scaled on X (300ms) to logged over total sets, in that exercise's own colour, so logged tape keeps its colour.

### Cards / Containers
24px radius, Chalkboard Brown, 16px padding, 16px internal gap, no border or shadow. Used for the input panel, rest panel, hold panel and done panel. The rest bar inside is an 8px pill track with a tape fill.

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
