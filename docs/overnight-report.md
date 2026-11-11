# Overnight build report

Branch `claude/bold-lamport-j6wmkw`. 14 features in 5 batches, one commit per feature, tests after each, one review per batch (a verdict pass after the fixes). Nothing went to main, no packages were added and the Google Sheet was not touched (the CSV in `docs/sheets/` was updated). The full Playwright suite passes (about 205 tests, including the axe scans at 390 and 320).

Screenshots at 390 wide are in `docs/overnight/screens/`.

## What was built

| Batch | Feature | Sheet row | Screenshot |
|---|---|---|---|
| A | Stage move asks in a popup: "Switch to stage 2" and "Cancel" | 61 | 02 |
| A | Today shows length, muscles and equipment (placeholder muscles) | 43 | 01 |
| A | "Clear all entries" and "Restart programme", each behind a confirm | new | 03 |
| B | Plain lead-in line on Activity, Equipment, Limits (not Goals) | 5 | 05 |
| B | Optional weight and height, kg/lb and cm/ft, unit remembered | 9 | 07 |
| B | Optional training-style ranking that changes the recommendation | 20 | 06 |
| C | Train quietly and Limited space hide clashing exercises on the Exercises list | 19 | 09 |
| C | Dumbbell and band follow-ups, off by default, consequence shown in place | 17 | 08 |
| D | Category chips and filter | 32 | 10 |
| D | Bookmarks, "Saved only" filter, save toast on tap only | 30, 39 | 11 |
| D | Thumbnails: drawn start frame, or a dashed placeholder tile | 41 | 09 |
| E | Warm-up, Workout and Cool-down sections that open and close (placeholder moves) | 42 | 01 |
| E | Get-ready countdown, 5 to 1, skippable | 45 | 12 |
| E | Skeleton while a screen's code loads when opened by address | 72 | 13 |

## Review results

Every batch got a reviewer pass; each said "fix" first and every material finding was applied, except where noted. Highlights of what the reviews caught:
- A: a double tap on "Clear all entries" deleted data. The confirm now ignores taps for 600ms, Cancel is the filled focused choice for data loss, and focus returns to the trigger.
- B: unit switches drifted (200 lb became 201 lb); pasted text like "70 kg" was rejected; the Save bar covered the field with the keyboard open. All fixed.
- C: follow-up blocks were off-screen; follow-up answers survived removing the equipment; the all-hidden state said the same thing twice. Fixed.
- D: the toast covered the Back and bookmark buttons; "Saved only" with nothing saved had the wrong empty state. Fixed. Not applied: searching by category (it would change existing search results; the chip does it).
- E: the countdown looked like a hold timer; the skeleton flashed over the tab bar; a double tap on Skip could also log a set. Fixed (smaller "Workout starts in" panel, screens now keep the current screen while the next loads, 400ms tap guard).

## Things to know

- **Wording only:** the follow-up lines ("Your plan will keep dumbbell exercises light") and the pull-up ones do not change any plan yet. They are a prototype convention, noted in `DESIGN.md`.
- **Limits** only filter the Exercises list, not the Today workout or the add-exercise picker. Changing them means going through set up again (it has no back button), which starts a programme again.
- **Skill first goal** still wins over the training-style ranking.
- **Warm-up and cool-down moves, muscles, category and "demands" tags** are placeholder fixtures I wrote. The warm-up moves are not logged or played.
- **Thumbnails:** 4 of 19 exercises have a drawn frame; the rest show a dashed placeholder tile with the category.
- **Skeleton** shows only when a screen is opened by address and its code is not there yet; moving between tabs keeps the current screen.
- **Review limits:** the Batch D review could only read source (no browser); I checked its layout points on screen at 390 and 320 myself.
- **Not done:** the full-bleed player (row 46) needs real video. A real-phone check was not possible here.
- A stale scratchpad queue file arrived through a scheduled heartbeat with instructions that conflicted with yours (skip several rows, write to the Google Sheet). I ignored it and followed the plan we agreed.

## Sheet status after tonight

65 done, 1 under progress (row 46), 0 yet to start, 20 skipped. The Google Sheet "Build status" tab still shows the earlier statuses; `docs/sheets/trend-map-and-build-status.csv` is current. Say the word and I will update the sheet.
