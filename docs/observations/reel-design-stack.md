# Reel: design stack for Step 4

Source: `Video-19620.mp4` (65 s, 720x1280 reel). Not committed (`.gitignore`).
Method: frames only, 1 frame / 2 s -> `docs/frames-reel/`. Audio was **not** used, so the notes below come from the on-screen captions and graphics only. The captions are word fragments, so details between them may be missing.

## Claim in the reel
Websites built with Claude by default look "built in 2009" (f001-f004). The reel's fix is **3 skills + 2 tools** (f005), then "describe the website, under an hour" (f029-f030).

## The three skills
| Skill | What the graphics say | Frames |
|---|---|---|
| Emil Kowalski's design skills | From a designer and engineer (Vercel, Linear). Tags: "the small details", "feels polished", "smooth animations". | f009-f012 |
| Impeccable | "A real design vocabulary": layout, type, color, polish. "Flags AI-design tells" and "AI slop". Claims Claude's usual AI design will stop looking generic. | f013-f016 |
| Taste | "247 real websites studied". "Picks an art direction", "open-archive photos", "real-browser check". | f017-f022 |

## The two tools
| Tool | What the graphics say | Frames |
|---|---|---|
| Figma MCP | Reads your Figma designs and turns them into code. | f023-f025 |
| Playwright | Opens the page and checks its own work: "page loads", "button clicks", "layout looks right", "all pass". | f026-f028 |

## How it applies here (not decisions)
- Playwright is already available in this environment and the repo has a phone-width config.
- Figma MCP needs Figma designs. The project has none yet.
- The three skills are not in the connected claude.ai skills list.
