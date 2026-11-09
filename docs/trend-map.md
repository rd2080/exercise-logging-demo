# Step 2: Trend map (keep / change / drop / add)

**Status: DRAFT for review.** Verdicts are my recommendations, not decisions. Change any row.
Inputs: `docs/observations/ntc-walkthrough.md` (IDs `N-x`) and `docs/observations/freeletics-walkthrough.md` (IDs `F-x`).
Scope: exercise pages only. The tracking-type text rules (Step 3) are **not applied yet**, so rows touching reps/time/weight are marked *pending Step 3*.

**Verdicts:** **Keep** = adopt as seen. **Change** = adopt the idea, adapt it. **Drop** = do not use. **Add** = not in either video, needed for our goals.
**Goal tags:** NUX = new-user page, LOG = logging experience, UX = general usability/look.

## 1. New-user (NUX) page

| # | Src | Trend | Evidence | Verdict | Our version / reason | Goal |
|---|-----|-------|----------|---------|----------------------|------|
| 1 | F-A1, A2 | One question per screen, progress bar + "n/N", back chevron, single full-width CTA | F f001-f048 | **Keep** | Core NUX skeleton. Keep N small (see #3). | NUX |
| 2 | F-A3 | Next disabled until a valid answer | F f004-f006 | **Keep** | Prevents empty states downstream. | NUX |
| 3 | F-A6, A8 | 12 questions, "5 mins" promise | F f001 | **Change** | Exercise NUX only needs what changes exercise choice (goal, level, equipment, constraints). Target ~4-5 steps. Show real time ("about 1 min"). | NUX |
| 4 | F-A5 | "Why we ask" callout under each question | F f009, f018 | **Keep** | Builds trust and explains personalisation. Plain text, one line. | NUX |
| 5 | F-A4 | Playful eyebrow lines above questions | F f004, f007 | **Change** | Keep tone friendly but drop filler. Only where it adds meaning. | NUX |
| 6 | F-B5 | Multi-select goals, max 3, numbered by pick order | F f018-f030 | **Change** | Keep the cap and ranking. Fix list overflowing under CTA (F-B6). | NUX |
| 7 | F-B6 | CTA overlaps the last option | F f018-f022 | **Drop** | Add bottom padding so nothing hides behind a pinned CTA. | UX |
| 8 | F-B7 | Fitness-level slider with a sentence that changes as you drag | F f032-f037 | **Keep** | Lets non-experts self-rate without jargon. Add tap alternative (accessibility). | NUX |
| 9 | F-B1, B2 | Numeric entry with unit toggle | F f004-f008 | **Change** | Only ask weight/height if the programme needs it. If asked: larger field near the CTA, remember unit. | NUX |
| 10 | F-B3 | Month/Year dropdown for birth date | F f010-f012 | **Drop** | Age is rarely needed for exercise pages. If needed, ask a single age band. | NUX |
| 11 | F-A7 | Consent wall first, loss-framed "Don't miss out!" nudge | F f001-f002 | **Drop** | Dark-pattern risk and out of scope (privacy/consent is a separate flow). Local demo has no tracking. | NUX |
| 12 | F-A9, A10 | Milestone screen ("10M athletes") and testimonial carousel | F f015-f017, f031 | **Drop** | Social proof needs real data we do not have. Revisit after launch. | NUX |
| 13 | F-A12 | Fake "AI is designing your plan" chart animation | F f050-f053 | **Drop** | Theatre, not user value. | NUX |
| 14 | F-D1 | Live checklist while plan is built ("Creating profile / Choosing workouts...") | F f100-f102 | **Change** | Only if build time is real. Otherwise skip to result. Use as a short confirmation summary of choices. | NUX |
| 15 | F-A13 | Account creation after the quiz | F f054 | **Drop** (for demo) | Fixture user only. Note for later: asking after value is shown is a good pattern. | NUX |
| 16 | F-C1 | Equipment picker with photos, +/check toggle, filter chips | F f059-f072 | **Change** | Keep photo + toggle. Shrink to a short list of common kit with "none" as the first option. | NUX |
| 17 | F-C3, C4 | Follow-up questions per equipment, toggles default ON | F f073-f089 | **Change** | Keep per-item follow-ups only when they change exercise choice. Defaults should be safe (off) and explain consequence in place. | NUX |
| 18 | F-C5 | Snackbar explains impact of turning everything off | F f084-f087 | **Keep** | Immediate consequence copy prevents dead ends. | NUX |
| 19 | F-C7, C8 | Everyday constraints as toggles ("Train quietly", "Limited space") | F f094-f099 | **Keep** | Situation-phrased, changeable any time. Strong for exercise selection. | NUX |
| 20 | F-B8 | Ranked training-style preference list | F f038-f046 | **Change** | Likely redundant with equipment + goal. Keep only if it changes recommendations. | NUX |
| 21 | N-F1, F2 | Empty state: image + headline + where data will appear + one CTA | N f089-f090, f098 | **Keep** | Template for every empty exercise page (no history, no programme). | NUX |
| 22 | N-F3, F4 | Locked achievements shown as a visible goal list | N f097 | **Keep** | Gives new users something to aim at. | NUX |
| 23 | N-F5 | "+" to add manual activity | N f089 | **Change** | Fits our logging goal, but flow unseen (see Add #A2). | LOG |
| 24 | F-A14 | "Athlete" placeholder until name known | F f001 | **Change** | Use a neutral greeting until profile exists. | NUX |
| 25 | F-E2 | Custom pre-prompt before OS notification dialog | F f055-f056 | **Keep** | Ask at a moment of value, with an easy "Not now". Needs fixture only in demo. | NUX |

## 2. Discovery and browsing

| # | Src | Trend | Evidence | Verdict | Our version / reason | Goal |
|---|-----|-------|----------|---------|----------------------|------|
| 26 | N-B1, B4 | Filters as chip groups: Duration, Level, Intensity, Equipment, Format | N f008-f014 | **Keep** | Filter set matches exercise needs. | UX |
| 27 | N-B2 | Live result count while filtering | N f007-f012 | **Keep** | Instant feedback. | UX |
| 28 | N-B3 | Undo/reset and apply icons | N f008 | **Change** | Use text labels ("Reset", "Show 24") instead of icon-only. | UX |
| 29 | N-B5 | Filter count badge on the list page | N f015-f016 | **Keep** | | UX |
| 30 | N-B6 | Consistent list card (thumb, title, meta, duration, bookmark) | N f007, f015 | **Keep** | Basis for exercise list cards. | UX |
| 31 | N-A3, A4 | Horizontal bands + search at top | N f004-f005 | **Change** | Single list + search is enough at demo size. | UX |
| 32 | F-F8 | Shelf of workouts with Category/Duration dropdown chips and equipment badge | F f111, f154 | **Keep** | Equipment badge on cards answers "can I do this" at a glance. | UX |
| 33 | N-A2 | Side-drawer navigation | N f086 | **Drop** | Hidden nav. Use a visible bottom tab bar (F-F1). | UX |
| 34 | F-F1 | Bottom tabs (Community, Coach, Profile) | F f108 | **Change** | Same pattern, our tabs (e.g. Today, Exercises, Progress). | UX |

## 3. Exercise / workout detail

| # | Src | Trend | Evidence | Verdict | Our version / reason | Goal |
|---|-----|-------|----------|---------|----------------------|------|
| 35 | N-C1, C2 | Hero with looping demo video, title overlay | N f017-f019 | **Change** | Demo video/GIF is a strong fit, but keep poster image fast-loading and respect reduced-motion. | UX |
| 36 | N-C3, F-G2 | Icon + text fact list (duration, level, equipment, pace) | N f017; F f120 | **Keep** | | UX |
| 37 | N-C5, F-G4 | One dominant pinned CTA ("Start") | N f018; F f120 | **Keep** | Reserve space so content never sits under it (N-C6). | UX |
| 38 | N-C6 | Content runs behind the pinned CTA | N f018-f019 | **Drop** | Layout flaw. | UX |
| 39 | N-C7, H2 | Bookmark toast tied to screen state, re-shown on return | N f019, f039 | **Change** | Keep the toast, fire only on action. | UX |
| 40 | F-G3, F5 | Exercise list with reps/seconds in the label ("30x Jumping Jacks", "30s Adductor Roll") | F f109-f120 | **Keep** | Makes the target readable before starting. *Pending Step 3.* | LOG |
| 41 | F-F6 | Exercise thumbnails, 3 per row, tiny captions | F f109-f114 | **Change** | Larger tap targets, readable captions (F-J5). | UX |
| 42 | F-F5 | Collapsible Warmup / Workout / Cooldown | F f109-f118 | **Keep** | Good structure for long sessions. | UX |
| 43 | F-F4 | Session card: duration, points, muscles, equipment | F f108-f110 | **Change** | Keep duration, muscles, equipment. Skip points until we have a scoring model. | UX |
| 44 | N-C8 | No list of exercises on workout detail | N f017-f019 | **Drop** | Show the list (see #40). | UX |

## 4. Player / doing the exercise

| # | Src | Trend | Evidence | Verdict | Our version / reason | Goal |
|---|-----|-------|----------|---------|----------------------|------|
| 45 | F-H1 | "Get ready" 5-4-3-2-1 pre-start | F f121-f123 | **Keep** | | UX |
| 46 | F-H2, H3 | Full-bleed demo video, big count + name + "Next:" preview | F f124-f151 | **Keep** | Best player layout seen. | UX |
| 47 | F-H4, H5 | Reps shown as `Nx` with no timer; holds as a countdown | F f124-f149 | **Keep** | Matches your push-ups example. Final rules come from Step 3. *Pending Step 3.* | LOG |
| 48 | F-H6 | "Get into position" lead-in before a timed hold | F f135-f136 | **Keep** | | UX |
| 49 | F-H7 | Left and Right as separate steps | F f135-f149 | **Keep** | Or a single step with a side switch. Decide in design. | UX |
| 50 | F-H8 | Segmented session progress bar | F f124-f151 | **Change** | Keep segments. Add "3 of 9" text for clarity (F-H9 missing). | UX |
| 51 | N-D1 | Letterboxed small video with large unused black space | N f026-f035 | **Drop** | Use full-bleed (#46). | UX |
| 52 | N-D2, D5 | Hidden controls, free scrubber | N f026-f035 | **Drop** | Scrubbing fits playback, not guided effort. Use pause and skip only. | UX |
| 53 | N-D6 | Playback speed and audio settings | N f037 | **Drop** | Not needed in a logging demo. | UX |
| 54 | N-D7 | 10 s branded splash before every session | N f020-f025 | **Drop** | Friction, repeated on re-entry. | UX |
| 55 | F-H14 | Camera icon (form check) | F f124 | **Drop** (for now) | Behaviour unseen. Revisit later. | UX |
| 56 | F-E5 | Offer toast over the player | F f121-f128 | **Drop** | No promotions during an exercise. | UX |

## 5. Programmes / goals

| # | Src | Trend | Evidence | Verdict | Our version / reason | Goal |
|---|-----|-------|----------|---------|----------------------|------|
| 57 | N-E1, E2 | Programme card: promise line + duration + required equipment | N f046-f058 | **Keep** | | UX |
| 58 | N-E3, F-D3 | Programme detail: stat tiles (weeks, frequency, level) + tag chips | N f059; F f059 | **Keep** | Basis for the goal programme page. | UX |
| 59 | N-E5 | Staged progress "Stage 1 of 3, Workouts completed 0 of 3" | N f062-f064 | **Keep** | | UX |
| 60 | F-F2 | Weekly day dots + streak + perfect week | F f103, f108 | **Change** | Keep weekly dots. Defer streak until logging exists. | UX |
| 61 | N-E8 | Confirm dialog to switch stage ("we recommend completing...") | N f076, f083 | **Change** | Inline note instead of a modal. Recommend, do not block. | UX |
| 62 | N-E9 | Activate Stage button that looks disabled | N f075-f077 | **Drop** | State must be unambiguous. | UX |
| 63 | F-D3 | Swipeable journey cards with "18 sessions, 6 weeks" | F f059 | **Change** | Candidate pattern for picking a goal programme (e.g. handstand push-up). Not a decision. | NUX |

## 6. Monetisation and interruptions

| # | Src | Trend | Evidence | Verdict | Our version / reason | Goal |
|---|-----|-------|----------|---------|----------------------|------|
| 64 | F-E1 | Paywall sheet with price cards | F f058 | **Drop** | Out of scope. | UX |
| 65 | F-E3, E4, E7 | Stacked offer modals, ticking countdown, sticky Subscribe bar | F f103-f128, f153 | **Drop** | Heavy interruption. | UX |
| 66 | F-E6 | Lock icons on content | F f108, f118 | **Drop** | No tiers in the demo. | UX |
| 67 | F-J6 | Floating elements colliding (toast + bars + CTA) | F f118-f121 | **Drop** | One floating element at a time. | UX |

## 7. Visual language

| # | Src | Trend | Evidence | Verdict | Our version / reason | Goal |
|---|-----|-------|----------|---------|----------------------|------|
| 68 | N-G1, F-J1 | Dark for focus screens, white video studio for demos | N f046 vs f007; F f124 | **Change** | Choose one theme first and compare the other in Step 5. | UX |
| 69 | N-G4, F-J2 | One accent colour + semantic green/red | N f018, f015; F f058 | **Keep** | | UX |
| 70 | N-G5, F-J4 | Pill buttons, rounded cards | | **Keep** | | UX |
| 71 | N-G7, F-J5 | Low-contrast small grey text | N f046-f054; F f003, f109 | **Drop** | Fails readability. Enforce contrast minimums. | UX |
| 72 | N-G6, F-J7 | Skeleton loaders and micro-motion | N f087; F f100-f102 | **Change** | Keep skeletons. Limit decorative motion. | UX |
| 73 | N-G8 | Scroll position lost on back | N f044 | **Drop** | Restore scroll on back. | UX |
| 74 | N-G3, F-J3 | Condensed display type for headlines | N f089; F f108 | **Change** | Decide in the "better-looking" version only (Step 5). | UX |

## 8. Add: gaps neither video fills

| # | Gap | Evidence it is missing | Proposed | Goal |
|---|-----|------------------------|----------|------|
| A1 | Logging what you actually did (reps, time, weight) | N-D9, F-H12 | Per-exercise log at the end of each step. Fields depend on tracking type. *Pending Step 3.* | LOG |
| A2 | Manual "log outside the app" entry | N-F5 (button only) | A fast add-exercise flow from empty states. | LOG |
| A3 | Rest between exercises/sets | F-H13 | Rest screen with skip and +15 s. | LOG |
| A4 | Post-workout summary and "what's next" | N, F-I1 | Summary with logged totals and next session. | LOG |
| A5 | Quick re-log / "same as last time" | Not in either | Prefill from last session. | LOG |
| A6 | Exercise history per movement | Not in either | Simple list of past entries. | LOG |
| A7 | Test coverage of NUX | Your objective #1 | Playwright phone-width checks for each NUX step and empty states. | NUX |

## Questions for you
1. **NUX length:** ok with ~4-5 questions (#3), or do you want a longer quiz like Freeletics?
2. **Consent and account steps** (#11, #15): confirm these stay out of scope.
3. **Birth date, weight, height** (#9, #10): keep any, or drop all?
4. **Player:** one set per screen (Freeletics style), or a Nike-style flowing session?
5. **Theme:** dark, light, or build both for the Step 5 comparison?
6. **Programme picker** (#63): do you want a goal programme in the first build, or just exercises?
