# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Mobile web at phone width (390 x 844 first). No native app. Fixture data, no backend. Runs locally; a public static demo with no login can be deployed (see the README), and everything a user logs stays in their own browser.

## Stack

React, Vite, TypeScript, Tailwind CSS and Motion, with Playwright for phone-width checks. Confirmed by the user. Fixture JSON stands in for data. The wider app's stack is unknown, so the demo may need porting later.

## Users

Beginners following a plan, and skill-goal athletes working toward a goal such as a handstand push-up. Both log their effort on a phone, during or just after a set. Beginners need the first-run flow to explain and guide them. Goal athletes need the plan and their history to show progress.

## Product Purpose

Exercise pages that record what the user actually did, not just play a workout back. The first build is the exercise player with set logging. After that come a short new-user flow, and later exercise lists and programmes. Success is a user logging a set in one tap without breaking their flow.

## Positioning

The Nike Training Club and Freeletics walkthroughs show follow-along products. Neither showed a way to record what the user did. This product logs sets in one tap, prefilled from the last session, and treats each tracking type correctly: no work timer on reps or reps per side, countdowns only for timed holds.

## Operating Context

Used on a phone, often one-handed, with the user tired and short on attention. The user sees an exercise demo (looping muted video, or start and end frames), then logs a set. A first-time user has no history, so values prefill from the programme target or a default.

## Capabilities and Constraints

Tracking-type rules for every exercise and logging screen:
- Never show a work timer for reps or reps per side.
- Show the exercise name and one form cue above the inputs.
- Logging a set takes one tap, prefilled from the last session.
- Button labels name the result, in sentence case ("Log set", not "Submit"). Exceptions: the icon-only plus button and the "Reset" filter button.
- Include a media slot: a looping muted video, or a start and end frame.

Tracking types in scope: reps, reps per side, time (holds), weight and reps.
Dark theme only. One polished design, no plain comparison version.
Agents never write test data to a live database. Everything runs on fixtures. Sets a user logs by hand are saved in that browser's local storage only (key `exercise-demo:entries`, versioned, validated on read); nothing is sent anywhere.
Undecided: the first exercises and the goal programme (the handstand push-up is only an example).

## Brand Commitments

None yet. No name, logo or voice has been set.

## Evidence on Hand

Frame observations of two reference apps and a design-stack reel in `docs/observations/`, the reviewed trend map (Google Sheet "Exercise Demo: Trend Map"), and placeholder fixtures in `fixtures/`.
Absent, and not to be invented: real exercise videos, photographs, form-cue copy, user history, testimonials, and any brand assets.

## Product Principles

1. Logging is the main job. Anything that slows a set log is wrong.
2. The screen follows the tracking type. A rep exercise never looks like a timed hold.
3. Show the exercise first: name, one cue, and the demo, above the inputs.
4. Prefill everything the app can know. The user only edits what differs.
5. Leave out promotion, decoration and interruptions during an exercise.

## Accessibility & Inclusion

WCAG 2.2 AA. Check contrast, tap target size and reduced-motion support in tests. Provide a still start and end frame fallback for users who prefer reduced motion.
