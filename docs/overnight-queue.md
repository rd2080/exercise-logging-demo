# Overnight build queue

Rules: one commit per feature, push after each, tests after each feature, one review per batch (plus a verdict pass), no prompts that need approval, no Google Sheet writes, no new packages, only branch `claude/bold-lamport-j6wmkw`. Tick a feature when it is committed and pushed. At the end write `docs/overnight-report.md` with 390px screenshots.

## Batch A: Programme and Today
- [x] Stage-move popup with "Cancel" and "Switch to stage 2" (sheet row 61)
- [x] Muscles on exercises, shown on the Today session card (row 43)
- [x] Clear-all and restart for entries and programme, with a confirm
- [x] Batch A review and fixes (review: fix; applied double-tap guard, focus, destructive layout, numeral face, DESIGN.md)

## Batch B: Set-up questions
- [x] Lead-in line per set-up question (row 5)
- [x] Weight and height with unit toggle, unit remembered (row 9)
- [x] Training-style preference ranking that changes the recommendation (row 20)
- [x] Batch B review and fixes

## Batch C: Set-up rules
- [x] Train quietly and Limited space filter exercises (row 19)
- [x] Equipment follow-up questions for dumbbells and bands (row 17)
- [x] Batch C review and fixes

## Batch D: Exercise list
- [x] Category chips on exercise rows (row 32)
- [x] Bookmarks with a save toast that fires only on the action (rows 30, 39)
- [x] Thumbnails: drawn figure where one exists, marked placeholder tile otherwise (row 41)
- [x] Batch D review and fixes (source-only review; applied 13 of 14, search by category left out on purpose)

## Batch E: Session and loading
- [ ] Warm-up and cool-down collapsible sections, placeholder data (row 42)
- [x] Get-ready 5-4-3-2-1 countdown before the first exercise (row 45)
- [ ] Skeleton loaders for lazily loaded screens and the demo media slot (row 72)
- [ ] Batch E review and fixes

## Last
- [ ] Update DESIGN.md, README.md and docs/sheets CSV statuses
- [ ] Write docs/overnight-report.md with screenshots
