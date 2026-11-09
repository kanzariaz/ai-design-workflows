---
name: park-it
description: Park an open, undecided decision with just enough context to pick it up cold later, and bring parked decisions back on request. Use when the user invokes /park-it or says "park it", "park this", "save this for later"; and when they say "show parked", "show me the parked decisions", "what's parked", "unpark N", or "pick up N".
---

# park-it – park decisions now, pick them up later

Decision chains get interrupted: a new idea comes up, the session runs out, the
user wants to switch topics. Parking saves where an undecided thread was left
so it can be picked up cold – in this chat or a later one – without
re-reading the whole conversation.

The saved card is the product, not the list. A card that can't restart the
work three weeks later has failed.

## Where parked decisions live

- One parked file per project, inside the repo the chat is working in. Use the
  project's existing backlog file if it has one (e.g. `PARKED.md`,
  `docs/parked.md`); otherwise create `PARKED.md` at the repo root. Never put
  a new file inside a folder the project publishes (a site's `docs/` or
  `public/`).
- Only ever read the current repo's file. "Show parked" means this project.
  If the user names another project you can't see from this chat, say so in
  one line – don't guess.
- No repo (a plain chat): use one personal file, `~/.claude/parked.md`, and say
  once that it's the personal list, not a project's.
- Write the file; don't commit or push unless the user or the project's
  working agreements say to.

## Parking ("park it")

1. **List the open decisions** you can see in the conversation as a numbered
   list and ask which to park. One short line each: a descriptive title, a
   dash, what's undecided. Settled things never appear as options.

   > **Which decision should I park?**
   >
   > 1. Signup-first redesign mockups – choosing a board, a coming-soon treatment and a form style
   > 2. Brand scope – skills vs full workflows, personal vs descriptive name
   >
   > Reply with a number or several.

   If there's only one open decision, still ask: "Park <title>?"
   If the user already named it ("park the canvas decisions"), skip to step 2.

2. **Show the draft card** for each pick and ask to save. Write it yourself
   from the conversation – the user never dictates it. Four lines:

   > **Parking: Signup-first redesign mockups for AI Design Workflows**
   > **Left off:** choosing a board, a coming-soon treatment and a form style
   > **Open:** A, B or C · 4 coming-soon treatments · 4 form styles · OK the placeholder copy
   > **Link:** [canvas](https://…)
   >
   > Save it?

   - **Title** says what the decision is about, specific enough to tell apart
     from anything else in the project. Never a bare medium or tool name
     ("Canvas review", "Figma stuff").
   - **Left off** is one line: the exact point the thread stopped.
   - **Open** is the remaining questions, separated by " · ".
   - **Link** only when there's an artifact, mockup, file or PR; drop the line
     otherwise.
   - Write the full version (adding why it was parked and what's already
     settled) only when the user asks for it.

3. **On yes, save** each card to the parked file (format below) and confirm in
   one line: "Parked: <title>." On a correction, fix the card and ask again.
   Several picks become separate cards, so each can be unparked alone.

4. Return to whatever the conversation was doing before.

## Showing ("show parked")

A plain numbered list – never bullets or a picker – so the user can answer
with a number. The header names the project. One line per open item: the
title and when it was parked. Nothing else: no counts, no notes about
resolved or hidden items.

> **Parked – design-skills**
>
> 1. Signup-first redesign mockups for AI Design Workflows · parked today
> 2. Brand scope for the rename · parked 3 days ago
>
> Which one do you want to pick up?

Most recent first. Resolved items are left out silently; show them only if the
user asks for resolved ones. If nothing is parked: "Nothing parked in
<project>."

## Picking up ("unpark N", or a bare number after the list)

Show that item's card, then ask its first open question so the work restarts
immediately:

> **Signup-first redesign mockups for AI Design Workflows**
> **Left off:** choosing a board, a coming-soon treatment and a form style
> **Open:** A, B or C · 4 coming-soon treatments · 4 form styles · OK the placeholder copy
> **Link:** [canvas](https://…)
>
> Starting with the board: A, B or C?

Unparking doesn't change the file. The item stays parked until it's decided.

## Resolving

When a parked decision gets made, edit its entry in place to a one-line
outcome and mark the heading resolved. Never silently delete an item; an item
the user drops becomes "→ Dropped: <why>".

## File format

```markdown
# Parked

Open decisions and deferred work. Items leave by resolution (edited to a
one-line outcome), never silent deletion.

### Signup-first redesign mockups for AI Design Workflows – parked 2026-11-09

**Left off:** choosing a board, a coming-soon treatment and a form style
**Open:** A, B or C · 4 coming-soon treatments · 4 form styles · OK the placeholder copy
**Link:** [canvas](https://…)

### License choice – resolved 2026-08-26

→ Decided: no license; the MIT file was removed.
```

Use absolute dates in the file; say "today" or "3 days ago" only in chat.

## Working with other skills

- Parking never adds to or changes a /list-it list.
- /explore's "Parked" exit uses this skill: same card, same file.
- A picked-up item goes back to exploring; it becomes real work only through
  the user's normal "go"/"execute" word.
