# AI Design Workflows — site

Landing site for Kanza's design skills, live at https://aidesignworkflows.com
(repo `kanzariaz/ai-design-workflows`, renamed from `design-skills`; GitHub Pages from
`main`/docs). `docs/` is the deliverable; rows render client-side
from `docs/skills.json`; Copy buttons copy `npx skills add kanzariaz/ai-design-workflows -s <id> -g`
(global: installs to ~/.claude/skills so it works in every project) and prefetch `docs/skills/<id>/SKILL.md`. Keep `docs/.nojekyll`.

## Working agreements

- Funnel: dictate → edit → verify on localhost preview (launch.json `design-skills-site`,
  port 4173) → push on the user's word. Big/risky rounds go on a test branch first.
- The user drives with /batch-it (append per item, execute on word), /jam-with-me, /mock-it, /park-it.
  Mock before building; when the user says "mock", do NOT touch files.
- Skill naming (locked, 2026-11-10) has two rules. It's branding (names read as Kanza's
  skills, not generic ones found elsewhere) and recall UX.
  1. Spoken phrases for in-the-moment actions – the name is what you'd say:
     /mock-it, /jam-with-me, /batch-it, /park-it, /save-rationale.
  2. Family prefixes for tool groups that will grow: canvas- (/canvas-capture; more
     canvas skills planned), design- (/design-eval).
  Each SKILL.md lists its own name as a spoken trigger. History: think-with-me → jam-with-me,
  queue-it → batch-it, move-to-canvas → canvas-capture.
- /canvas-capture is NOT exploration (mock-it is for inline iteration). It's the end-of-work
  step: puts the implemented designs on one canvas artifact as a bird's-eye source of
  truth; creates the canvas if none exists, refreshes it on every later run.
- User is learning git — explain terminal steps plainly, one at a time. Their GitHub
  PAT is in the macOS keychain (set up 2026-09-05), so Claude can push. No brew, no gh.
- En dashes (–) everywhere in site copy; em dashes are banned.
- All type routes through the tokens in styles.css `:root`. Ladder: names + form title
  `--text-skill-name` (600, 21–25); page title `--text-title` (700, 30–44); body
  `--text-body` (400 18 — do NOT let consumers override sizes); section labels Inter
  600/18; buttons `--text-button` (Inter 600/14); errors `--text-caption` (Inter 600/14).
- Hero subtitle is italic; everything else upright (signup subtext deliberately upright).

## Email signup (live, wired)

- Posts directly to Kit form `9881799` (`app.kit.com/forms/9881799/subscriptions`),
  FormData `email_address` + `fields[source]`. No proxy, no keys. Double opt-in is ON
  → success copy says "check your email to confirm"; soften if the user disables it.
- ONE list, no per-skill segments (locked decision). Per-skill intent is captured only
  as the `source` field (skill id or "direct") — needs a custom field `source` created
  in Kit to persist; unconfirmed whether the user made it.
- Subscribe disables on success; any edit to the field re-arms the form.
- Junk test subscribers `test@example.com` / `livetest@example.com` may still need
  deleting in Kit.

## Coming-soon / notify system

- Chip sits ON the divider above its row (ground fill masks the line, hairline stroke,
  7px radius, olive text); both neighbor rows yield +4px on the chip-facing side
  (`.skill-row--soon` + `:has(+ .skill-row--soon)`). One placement at every width.
- Button is "Notify Me" (bell, outlined 1.4 stroke, solid olive border, #eef2da fill):
  scrolls to the signup, focuses the field (the focus light-up IS the arrival cue —
  no box animations, that's a locked veto), records the source skill.
- When a skill ships: flip its skills.json `status` to "copy" — everything else follows.

## Analytics (TelemetryDeck, live)

pageview · copySkill{skill} · shareSkill{skill, method: sheet|link} · notifyClick{skill} · signupSuccess{source, placement: hero|footer} ·
signupError{kind: invalid|network} · socialClick{platform}. APP_ID is set in
docs/analytics.js.

## Open items

- Kit custom field `source` (user-side, 1 min) for source data to persist.
- Kit double opt-in: decide keep/disable; adjust success copy if disabled.
- Favicon slash is a drawn bar, not the true Fraunces glyph — trace the glyph if wanted.

Canvas: https://claude.ai/artifact/WzXSU4oEDnSLPrKaPwo9Wd (Claude Design canvas; /canvas-capture
updates it – edit the .dc.html files inside its `appifact-doc` JSON, never overwrite the page).

Rationale and rejected directions: docs/design-context.md.
