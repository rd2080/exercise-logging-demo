# Step 1: One-shot observations, Freeletics walkthrough

Source: `Screen_Recording_20261109_142536_Freeletics.mp4` (309 s, 1080x2340 portrait, Android screen recording). Not committed (`.gitignore`).
Method: frames only, no audio, 1 frame / 2 s -> `docs/frames-freeletics/f_NNN.jpg`. Frame `f_NNN` = time `(NNN-1)*2` s.
Pass 1 was open-ended: no fixed questions, no tracking-type rules loaded. Anything not visible is marked **not seen**.
Comparison with the Nike walkthrough is kept to a final section so the two stay independent observations.

## Flow seen
Onboarding quiz 1/12-11/12 (f001-f048) -> "AI Coach is designing your plan" (f049-f053) -> account creation (f054) -> notification permission (f055-f056) -> paywall (f058) -> choose a Training Journey (f059) -> equipment picker (f060-f072, f090-f093) -> pull-up bar space check (f073-f089) -> schedule + preferences (f094-f099) -> "Building your personalized training plan" (f100-f102) -> offers/modals (f103-f108) -> Coach home: today's session "Start Strong" (f108-f114) -> session detail (f119-f120) -> workout player with countdown (f121-f151) -> back to home (f152-f154).

## Trends

### A. Onboarding structure (new-user flow)
- **A1. Fixed-length progress: a thin bar plus "n/12" counter and a back chevron** on every question. f001-f048.
- **A2. One question per screen, big headline, one sentence of helper text, a single full-width "Next" CTA pinned at the bottom.** f003, f018, f032.
- **A3. "Next" is disabled (dim) until a valid answer exists, then enabled.** f004 -> f006; f031-f032; f047 -> f048.
- **A4. A small eyebrow line above each question gives a friendly lead-in** ("You won't sweat it alone!", "Time to push your limits", "Your AI Coach has your back"). f004, f007, f009.
- **A5. A blue info callout under the question explains why it is asked** ("Your AI Coach uses this information to design the plan that's more effective for your age."). f009, f018.
- **A6. Ordered flow: consent -> sex -> weight -> height -> birth date -> social proof -> goals -> milestone -> fitness level -> training preference -> mindset -> reward/summary.** f001-f053.
- **A7. A consent wall is the very first screen** ("Help us improve" with Accept All / Accept Only Necessary / Customize). f001. Declining personalisation triggers a loss-framed nudge with a bullet list of what you lose ("Don't miss out!", Enable / Deny / More information). f002.
- **A8. Time promise up front: "5 mins".** f001.
- **A9. Mid-flow celebration/milestone screen with a big counter** ("Alright, let's get fit! We've helped 10,342,119 Free Athletes get fit so far.") at question 8. f031.
- **A10. Social proof carousel** ("Stories from Athletes like you") with photos, quotes, name and age; horizontally swipeable, next card peeking. f015-f017.
- **A11. Value prop screen before the signup wall** ("17 minutes a day. That's all you need.") f049.
- **A12. A fake "AI is designing your plan" step** with an animated chart (You with / without Freeletics) before account creation. f050-f053. Pacing device, not user input.
- **A13. Account creation comes AFTER all questions** (email / Google / Decathlon), "Already have an account? Log in". f054.
- **A14. Welcome copy addresses the user as "Athlete" until the real name is known ("Rajeev" appears after signup, f059).** f001, f054.

### B. Input patterns in the quiz
- **B1. Numeric entry with unit toggle** (KG | LB, CM | FT) beside the field; the field auto-focuses and opens a numeric keypad with a "Go" key. f004-f008.
- **B2. The input is tiny and sits in the vertical middle of the screen**, far from the Next button and above the keyboard. f007. Next button rides above the keyboard once open. f008.
- **B3. Birth date uses two dropdowns (Month, Year)** opening full-screen radio lists; years start at 2008. f010-f012. No day.
- **B4. Single-choice cards** (Female / Male / Non-binary) with an icon each; large 76 px rows. f003.
- **B5. Multi-select goals, max 3, with the tap order shown as numbers (1, 2, 3)** and a one-line hint "Select up to three options." f018-f030. Selection is a blue tint + rank number.
- **B6. Goals list is longer than the viewport; Next button overlaps the last item ("Burn fat").** f018-f022. User has to scroll to see all 6 options.
- **B7. Fitness level is a slider** with an anchor label at each end ("Not fit at all" / "Really fit") and a **descriptive sentence that changes as you drag** ("When I sit on the floor I have trouble standing up", "I lose my breath when walking up a couple flights of stairs", "I occasionally exercise enough to break a sweat"). f032-f037. A hand-pointer hint "Slide to choose" shows until first use.
- **B8. Ranked preference list for training style** (Bodyweight, Dumbbells, Running, Barbell, Kettlebell), each with photo, name, and "No equipment needed"/"Any weight that works for you". Tap order becomes rank badges with an X to undo. f038-f046.
- **B9. Statement choice cards** for mindset ("I am new to fitness", "I need help getting back into routine", ...). f047-f048.

### C. Personalisation depth: equipment and constraints
- **C1. Equipment picker: a long list (~30 items) with photo, name, "Learn more", and a circular +/check toggle**, with filter chips (All, My Equipment, Free Weights, Gym Machines). f059-f072, f090-f093.
- **C2. A floating "Continue" pill overlays the list at the bottom**, covering the last row. f061-f072.
- **C3. Item-specific follow-up questions**: choosing Pullup Bar triggers "How much space do you have available for your pullup bar?" with four toggles, each with an illustration (hang fully extended; space for muscle-ups; room to swing side to side; bar secure for jumps and swings). f073-f089.
- **C4. All toggles default ON; switching them off is the work.** f073-f088.
- **C5. A snackbar explains the consequence when everything is turned off** ("You have turned off all settings. You will only receive Pullup bar exercises that require minimum space."). f084-f087.
- **C6. Equipment rows show a "..." (edit) button next to the check for items with follow-up settings.** f090-f093 (Pullup Bar).
- **C7. Schedule + preferences hub**: "Training days this week (Mon, Wed, Fri)", "Excluded exercises (None)", and three toggles: No sprints or runs, Limited training space, Train quietly. f094-f099. Copy states "You can change these any time."
- **C8. Toggles for everyday constraints are phrased as the user's situation, not a medical form**, and take effect immediately (f097-f099).
- **C9. CTA "Start Journey" is a centred pill, not full-width** (differs from Next in the quiz). f094-f099.

### D. Plan build + reveal
- **D1. Plan-building screen with three live checklist steps** ("Creating your profile", "Choosing workouts that meet your goal", "Finalizing your training plan"), each ticking in turn with spinner dots. f100-f102.
- **D2. Brand hexagon "C" mark replaces spinner mid-sequence.** f101.
- **D3. Choose-a-Training-Journey screen**: swipeable cards with a hero image, name ("Start Strong"), "18 sessions - 6 weeks approx.", tag chips (BEGINNER TRAINING, EASIER EXERCISES, GRADUAL INTENSITY, BUILD STABILITY, GET YOUR HEART RATE UP), "Show more", pager dots, CTA "Select this Training Journey". f059.

### E. Monetisation and interruptions
- **E1. Paywall sheet with benefits list and three price cards (3/6/12 months, "BEST VALUE" badge on 12) and "Subscribe now".** f058.
- **E2. Notification pre-prompt**: custom screen (bell icon, "Turn on reminders" / "Not now") BEFORE the OS permission dialog. f055-f056.
- **E3. Repeated modals on first arrival at home**: gift offer "A special gift for you, Rajeev!", limited-time 15% off, "Today is Day 1" start screen, then a persistent "Act fast!" 50% countdown banner (00:00:49:52 counting down), then a toast "Better offer unlocked: Now 30% off". f103-f108, f118-f125.
- **E4. A countdown timer is embedded inline at the top of the home feed and still ticks during workouts and scroll.** f108-f115, f153-f154.
- **E5. Offer toast overlays the workout player (top) during the pre-start countdown and exercise.** f121-f128. Dismissible with X.
- **E6. Locked content shown inline**: lock icons on session parts ("Progression to Standups", "Interval") and a "Personalized (lock) | Build your session" toggle. f108, f118.
- **E7. A sticky "Subscribe now" bar is pinned to the top while scrolling the home feed.** f109-f115.

### F. Home / Coach tab (post-onboarding, free tier)
- **F1. Bottom tab bar with 3 tabs: Community, Coach, Profile.** Coach highlighted. f108-f154.
- **F2. Top strip: weekly day dots (today 09/11 highlighted, Tue-Sun) plus "Streak 0" and "Perfect week" progress segments**, with settings and target icons. f103, f108.
- **F3. "Training Session" toggle: Personalized (locked) vs Build your session.** f108.
- **F4. Session card: name ("Start Strong"), "0 of 18 sessions", "STRENGTH" display type, duration "28-35 min", points ("655 points"), muscle groups ("Core, Lower, Legs"), equipment ("Foam roller & Resistance band"), plus a body diagram with highlighted muscles.** f108-f110.
- **F5. Session breakdown as collapsible sections: Warmup (5-6 min - 1 round), Workout, Cooldown.** Each lists exercises as a thumbnail grid with **reps or seconds prefixed in the label** ("30x Jumping Jacks", "10x Climbers", "30s Adductor Roll Left", "12x Lunge and Reach Right", "8x Assisted Standups", "12x Hip Raises", "8x Reverse Lunges"). f109-f114.
- **F6. Exercise thumbnails are still photos, 3 per row, with a tiny caption below.** f109-f114.
- **F7. Workout section shows time and rounds as metadata** ("Interval 17-23 min - 5 rounds"). f118.
- **F8. Unlocked workouts shelf: filter dropdown chips (Category, Duration) + horizontally scrolling cards with title, one-line blurb, an equipment badge ("NO EQUIPMENT"), and duration ("5-8 min").** f111, f119, f154.
- **F9. Upsell card "Become your best self - Get your training plan [Let's go!]"** inside the feed. f111.
- **F10. "Daily Activities" section header lower on the page; "Sync fitness data" card (Health Connect icon).** f119, f154.

### G. Exercise / session detail
- **G1. Workout detail: title ("Core Ready"), a horizontal carousel of exercise tiles with a play button each and a download glyph, name under each.** f120.
- **G2. Facts block with icons: equipment ("No Equipment"), duration ("5-8 min"), pace ("Comfortable Pace").** f120.
- **G3. "Summary" list of exercises with reps and thumbnails** ("50x Skipping Jumps", "50x Jumping Jacks"). f120.
- **G4. Pinned "Start" pill over the list; cast and overflow icons at the top.** f120.
- **G5. Exercise thumbnails that haven't loaded show a grey placeholder with the brand hexagon.** f120, f073-f075.

### H. Workout player
- **H1. Pre-start countdown "5 ... 3 ... 1" in huge numerals with "Get ready" and the first exercise name.** f121-f123.
- **H2. Exercise screen = full-bleed looping demo video on a white studio background; close (X) top-left, a camera icon top-right.** f124-f151.
- **H3. Bottom sheet over the video: big prefix count + exercise name + "Next: ..." preview.** E.g. "50x Skipping Jumps / Next: 50x Jumping Jacks". f124-f129.
- **H4. Rep-based exercises show "N x" and no timer** (50x Skipping Jumps, 50x Jumping Jacks, 20x Crunches, 10x Plank Knees-to-Elbows, 5x Warmup Roll, 30x Mountain Climbers, 20x Ground Supermen). f124-f134, f150-f151.
- **H5. Hold exercises show a live seconds countdown and a pause button** (10s High Side Plank Hold Left: 10s -> 8s -> 6s -> 4s -> 2s). f137-f141. Same for the Right side. f142-f149.
- **H6. Holds get a "Get into position" lead-in with a small progress bar and the full duration shown ("10s")** before the countdown starts. f135-f136, f142-f144.
- **H7. Left/Right variants are separate steps** ("High Side Plank Hold Left" then "... Right"). f135-f149.
- **H8. A segmented progress bar of the whole session sits at the very bottom (9 segments), completed ones black, current one blue,** with a "Next:" label. f124-f151 (f151 labelled "Final exercise").
- **H9. Per-step progress is not a number, it is segments; there is no total elapsed time or "step 3 of 9" text.** Not seen.
- **H10. Demo performers are varied** (different people per exercise, men and women), shot on a seamless white background with an exercise mat. f124-f151.
- **H11. Rep-count exercises: how the user advances to the next step is not visible in frames.** f124-f134 spend 2-4 s per exercise in this recording while "50x" is shown, so advance is either manual, auto-timed, or the tester tapped through. **Not determinable.**
- **H12. No input for actual reps performed, weight, effort, or difficulty feedback appears during or between exercises.** **Not seen.**
- **H13. No rest screen between exercises in the frames** (exercise -> exercise directly). **Not seen**; one 20x Ground Supermen is labelled "Final exercise" (f151).
- **H14. Camera icon top-right suggests a video / form-check mode.** Not tapped; behaviour **not seen**.

### I. End of workout
- **I1. After the final exercise the app shows a loading spinner (f152) and returns to the Coach home (f153)** with the countdown banner still showing. No completion summary, points earned, streak change, or feedback prompt appears. **Not seen** (session may have been closed early, so unclear).

### J. Visual language
- **J1. Dark navy/slate theme for UI, white for demo videos.** Strong contrast flips on the player. f108 vs f124.
- **J2. Single accent: bright blue for CTAs, selected states, progress; orange only for prices/discount (e.g. offer cards).** f058, f116.
- **J3. Condensed uppercase "tech" display type for labels (e.g. STRENGTH, BEGINNER TRAINING tags) and large numerals for counts.** f108, f059.
- **J4. Rounded pill CTAs; rectangles with thin outlines for selectable cards.** f003 vs f047.
- **J5. Low-contrast grey helper text on dark background** (subtitle lines, "Learn more", exercise captions under thumbnails). f003, f061, f109.
- **J6. Sticky and floating elements stack and collide** (offer toast + top bar + Subscribe bar + CTA), reducing usable screen in f118-f121.
- **J7. Heavy use of motion and micro-feedback**: animated charts (f050-f053), checklist ticks (f100-f102), numbers counting down (f121-f123).

## Not seen in this video (gaps)
- Rep or weight logging (what the user actually did), set tracking, RPE or difficulty rating.
- Rest periods and how rep exercises advance.
- Post-workout summary, achievements, points, streak change.
- Exercise detail page for a single movement (the "Learn more" content).
- History / Profile / Community tabs.
- "Build your session" (custom workout) flow.
- The camera / form-check feature.

## Observations that map to the examples in the handoff (not decisions)
- "Push-ups shouldn't be timed": consistent with the video: rep exercises show `Nx` with no timer, only holds get a countdown (H4, H5).
- "Use GIFs or video": the player uses full-bleed looping video; the home/summary uses still thumbnails (H2, F6).
- Goal programme: Freeletics chooses a goal, a training preference and equipment up front and generates a multi-week "Training Journey" (D3, A6). This is a candidate pattern, not a decision.

## Comparison: what differs from the Nike walkthrough
| Area | Nike (NTC) | Freeletics |
|---|---|---|
| Entry | Browse a catalogue (search, filters) | Quiz to personalise, then a single plan |
| New-user | Light: empty states and locked achievements | Heavy: 12-step quiz, equipment, constraints, plan-building theatre |
| Exercise unit | Time-based follow-along video | Reps (`Nx`) for strength, seconds for holds |
| Logging | Not seen | Not seen (no actual-reps input either) |
| Progress | Stage progress bar in programme; scrubber in player | Segmented session bar in player; streak/week dots on home |
| Monetisation | Not prominent | Very prominent, interrupts flow |
| Visual | Light browse, dark detail/player, photo-led | Dark UI, white video studio, blue accent, tech type |
