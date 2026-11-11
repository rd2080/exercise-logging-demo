# Step 1: One-shot observations, Nike Training Club walkthrough

Source: `Nike_Train_Club_Testing_UX.mp4` (200 s, 480x1040 portrait, Android screen recording). Not committed (see `.gitignore`).
Method: frames only, no audio, 1 frame / 2 s -> `docs/frames/f_NNN.jpg`. Frame `f_NNN` = time `(NNN-1)*2` s.
Pass 1 was done open-ended: no fixed questions, no tracking-type rules loaded. Anything not visible in a frame is marked **not seen**.
This is a recording of a user (not a spec). Observations describe what the screens show, not intent.

## Flow seen
Workouts home (f002-f006) -> Strength category + filters (f007-f016) -> workout detail "Go, Rest, Repeat" (f017-f019) -> video player (f020-f038) -> back to detail with "Workout Saved" (f019, f039) -> player again (f040-f043) -> Programmes (f046-f058) -> programme detail (f059-f061) -> staged programme "Stage 1: Lace Up" (f062-f066) -> workout detail + player (f067-f073) -> stage switching with confirmation (f075-f084) -> side nav (f086) -> Saved Workouts (f088) -> Activity empty state + Achievements (f089-f099).

## Trends

### A. Information architecture
- **A1. Three-level content model: Category -> Workout -> Programme(Stages -> Workouts).** Categories (HIIT/Strength/Yoga/For The Gym) f006, f044; Programmes as separate top-level list f046-f058; stages inside a programme f062-f064.
- **A2. Side-drawer navigation, 6 destinations** (Workouts, Programmes, Home, Saved Workouts, Activity, Inbox with badge, Settings). f086, f094, f100. Current section highlighted.
- **A3. Home/browse is a stack of horizontal bands**: a featured theme ("Hybrid Mode"), "Studio Sessions", "Browse by category", each with a "View all". f004-f005, f091.
- **A4. Search bar at the top of browse.** f004, f091.

### B. Discovery and filtering
- **B1. Filters are a full screen of single-row chip groups**: Duration, Level, Intensity, Equipment, Format, then Sort. f008-f014.
- **B2. Live count of results while filtering** (440 -> 32 -> 24 -> 4 workouts) shown under the title, title becomes "N Filters". f007-f012.
- **B3. Undo/reset and confirm icons** top right of the filter screen. f008, f014.
- **B4. Selected chips are solid black, unselected are outlined pills**; large tap targets, 2-3 options per row. f010-f012.
- **B5. After applying, the list page shows a red filter-count badge and "Filters (4)"**. f015-f016.
- **B6. List cards are consistent**: thumbnail, title, "Level - Equipment - Type", duration, bookmark icon. f007, f015.

### C. Workout detail
- **C1. Full-bleed hero image/video with title overlaid**, back and bookmark at top. f017-f018.
- **C2. Hero becomes a looping demo video** a second or so after load (still image f017 -> person moving f018-f019, f043). 
- **C3. Facts as an icon + text list**: duration & level, focus areas, space/equipment, format (or music genre). f017, f067.
- **C4. One short descriptive paragraph** under the facts. f017, f067.
- **C5. Single dominant CTA "Start workout", pinned at the bottom**, with a secondary round music icon beside it. f018, f039.
- **C6. Pinned CTA overlaps the content**; text runs behind and under it (the description is cut at the button). f018-f019. Looks like a layout flaw rather than intent.
- **C7. Bookmark gives immediate toast feedback** ("Workout Saved", green bar). f018-f019, f073. Saved items appear in Saved Workouts. f088.
- **C8. No list of the exercises inside the workout was seen on the detail screen** (only the paragraph). **Not seen** beyond f017-f019, f067, f072.

### D. In-workout player (guided, video-led)
- **D1. Video is letterboxed in the middle of a black screen**; large unused black space above and below. f026-f035.
- **D2. Controls appear on tap, then fade**: previous, back 10 s, pause (centre, largest), forward 10 s, next. f026-f028 show the fade-in, f029-f030 controls hidden.
- **D3. Overlay shows exercise name, a per-exercise countdown, and a mode word** ("0:30 Dynamic Quadriceps Stretch - Alternating"; "0:06 Bodyweight Squats"). f029, f036.
- **D4. The countdown is time-based for every exercise seen**, including squats and A-skips. f034-f038. Reps are **not seen** anywhere.
- **D5. Bottom bar: elapsed time + total ("14:35 - 30:31"), a scrubber, and a settings gear.** f035, f037.
- **D6. Settings sheet: Speed (Normal), Audio (Auto)**. f037.
- **D7. Branded splash (Nike swoosh) precedes the player, ~10 s**, with an audio-level glyph. f020-f025, f040-f041.
- **D8. Scrubbing is free-form**; progress jumped 00:55 -> 06:04 -> 14:35 in a few seconds. f033-f035.
- **D9. The player never showed a logging input** (no weight, reps, sets, or "mark done" step). **Not seen.**

### E. Programmes (multi-week structure)
- **E1. Programme cards: image, title, one-line promise, then small grey meta** ("4 weeks, bodyweight only", "6 weeks, dumbbells (bodyweight options), stability ball, block"). f046-f058.
- **E2. Meta carries duration + required equipment**, so equipment is stated before commitment.
- **E3. Programme detail = hero + 4 stat tiles** (weeks, frequency "3x a week", level "All Levels", workout length range) and a **"Start programme"** CTA. f059-f060.
- **E4. Branded full-screen transition ("READY, SET, LET'S GO") on start**. f061.
- **E5. Staged progress**: "Stage 1: Lace Up", 3-segment progress bar, "Workouts completed: 0 of 3". f062, f064.
- **E6. First workout is a large featured card (tagged "First workout"), the rest are a compact list** with duration + level. f063-f065.
- **E7. Secondary actions are outlined buttons: "Go to next stage", "View programme progress"**. f064, f074.
- **E8. Moving to another stage needs a confirm dialog** ("Are you sure? We recommend completing all workouts before moving onto different stage." Cancel / Activate). f076, f083. Sequence is recommended, not enforced.
- **E9. Stage preview screen with "Activate Stage" CTA** (disabled-looking grey until tapped, then white). f075-f077.
- **E10. Overflow (three-dot) menu on the programme screen**; contents **not seen**. f062-f074.

### F. New-user / empty states
- **F1. Activity tab for a user with no history is a full-bleed photo with a headline, one line of explanation, and one CTA**: "KEEP YOUR TRAINING ON TRACK - Your workouts are recorded here. Tap the plus to add any activities you do outside the app. [Find a Workout]". f089-f090, f098.
- **F2. The empty state explains where data will appear and how to add it ("Tap the plus")**, and offers the next best action.
- **F3. Achievements tab for a new user shows locked, greyed badges** (weekly counts "3x in a Week"... and streaks "2 Weeks in a Row"...). f097. Headline "TRAIN AND COLLECT - You did it, now celebrate it. Workouts now earn trophies, awards and streaks." f096.
- **F4. Locked badges are visible up-front as a goal list**, not hidden. f097.
- **F5. Plus (+) in the Activity header for manual entry**. f089. The manual-entry flow itself was **not seen**.
- **F6. Saved Workouts has a simple count ("2 Workouts") and the same list card.** f088.

### G. Visual language and craft
- **G1. Light theme for browsing/filters, dark theme for programmes, detail, and player.** Contrast change signals mode. f007 vs f046.
- **G2. Strong photography, people of varied body types/ages** (e.g. pregnancy programmes). f047-f050.
- **G3. Condensed bold uppercase display type for marketing headlines**, neutral sans for UI. f089 vs f062.
- **G4. One accent: green only for success toast, red only for badges/notifications**; everything else is black/white/grey. f018, f015.
- **G5. Consistent pill buttons and rounded-corner cards.**
- **G6. Skeleton / spinner loading states** (blank list with spinner f087; ghosted card f082).
- **G7. Low-contrast small grey text** is used for meta lines on dark cards (f046-f054) and on the filter subtitle. Readability risk.
- **G8. Screens are long scrolling columns**; scroll position is lost on navigating back (e.g. f044 list resets to top).

### H. Behaviours that look like friction (from the recording)
- **H1. Player controls need a tap to reveal and sit over the video.**
- **H2. Back from player returns to detail, which re-shows the "Workout Saved" toast** (f019 and f039), implying the toast is tied to the screen state, not the action.
- **H3. The same transition/splash is shown on repeat entries** (f020-f025 and f040-f041).
- **H4. Switching stage shows a heavy confirm dialog; dialog and button briefly disagree** (button greyed under dialog). f076-f077, f083.
- **H5. Tester jumped between sections; the OS app switcher is visible** ("2 active apps", Close all) f093 - not app behaviour.

## Not seen in this video (gaps to fill later)
- Any set / rep / weight logging, rest timers, or per-exercise history.
- The list of exercises inside a workout before starting.
- Post-workout summary or completion screen.
- Programme progress screen and the overflow menu contents.
- Onboarding or first-launch flow (the user is already signed in).
- Manual "+" activity entry.

## Caveat
Two walls of text on-screen ("Your workouts are recorded here...") plus video-first structure suggest NTC is a *follow-along* product. The exercise-logging experience we are designing is a *record-your-own-effort* one, so D (player) and G apply by analogy more than directly.
