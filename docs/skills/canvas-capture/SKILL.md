---
name: canvas-capture
description: Bring a code-first product's designs from code onto one design canvas, inside Claude Code – one frame per screen, sorted by flow. Every run captures the product's live state and updates the same canvas, so the canvas always shows the product as it is now. Use when the user invokes /canvas-capture or says "canvas capture", "capture it", "capture this on the canvas", "put the screens on the canvas", or "update the canvas". Not for exploring options – that's /mock-it.
---

# canvas-capture – from code to canvas

When the design lives in code, there's no Figma file that stays current, and
keeping one up to date by hand turns Figma into a storage unit. This skill
does that job inside Claude Code: it draws every screen of the product as a
frame, sorts the frames by flow on one canvas, and redraws them from the live
product every time it runs.

The canvas is a mirror of the product, not an archive. It shows what is
**running now**: no options, no rejected directions, no unbuilt mockups, no
old versions kept "for history".

## When to run it

- The user asks ("canvas capture", "update the canvas").
- After a round of changes is built and verified, you may offer it in one
  line ("Want me to capture this on the canvas?"). Never run it unasked.

## 1. Find the canvas

Look for the project's canvas link in its context files (CLAUDE.md, a design
context doc, or memory), recorded as a line like `Canvas: <link>`.

- **Found** → read it before changing anything (see "Updating").
- **Not found** → first run: create it (see "Creating"), then record the link
  in the project's main context file so every later run finds it.
- **Several candidates** → ask which one is the source of truth, in one line,
  and record that one.

## 2. Find the screens and flows

- List every screen the product has, from the code (routes, pages, views,
  navigation), and group them into flows (e.g. onboarding, checkout,
  settings). A one-page site is one flow.
- Every run captures **all** screens, not just the ones that changed – that's
  what keeps the canvas live.
- If it's unclear what counts as a screen or a flow, list your reading as a
  short numbered list and ask once. Don't ask about anything the code answers.

## 3. Capture the live state

Every frame is a faithful copy of the product as it runs right now:

- Draw from the running product where you can (the local dev server, a
  simulator, the built pages), otherwise from the current code. Never from
  memory or an earlier mockup – if they disagree, the product wins.
- Real design tokens (colors, type, spacing, radii) and real copy, read from
  the source each time.
- Each screen at the sizes it ships – typically desktop and phone side by
  side.
- States that matter and are cheap to show (empty, error, success, coming
  soon, focus) go on as extra frames next to their screen.

## 4. Lay it out

- One row per flow, screens in the order a user meets them, left to right.
- Label each frame: screen · size · state.
- A small **Last captured** note: date, branch or commit, and one line per
  thing that changed since the previous capture. Newest entry on top.

## Creating (first run)

Use the host's design canvas if it has one (a canvas or design artifact type
– check what the host offers before hand-building anything). Otherwise make
one page with labeled frames in flow rows. Name it after the project, e.g.
"<Project> – canvas". Then record the link (step 1).

## Updating (every later run)

1. Read the current canvas first.
2. Redraw every screen's frames from the live product, in the same spot and
   at the same size the user left them.
3. New screens get frames in their flow's row.
4. A frame whose screen no longer exists in the product, or that shows an
   older version of a screen: ask once before removing it, listing them.
5. Keep anything the user made themselves (their notes, annotations,
   arrangement).
6. If the canvas changed under you while you were working (the user saved it
   from inside), merge your changes onto their version – never overwrite it.
7. Add the new **Last captured** entry.

## Finish

End with the canvas link and a short list of what was captured. Don't commit
or push anything unless the project's working agreements say to.

## Working with other skills

- /mock-it explores options inline in the chat; nothing from a mock goes on
  the canvas until it's built.
- /batch-it collects changes and builds them on "go"; once that batch is
  built and verified, it's a natural moment to offer /canvas-capture.
- /save-rationale records *why*; the canvas shows *what*.
