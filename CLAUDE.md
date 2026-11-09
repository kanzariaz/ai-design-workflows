# AI Design Workflows – site

Landing site for Kanza's design skills, branded **AI Design Workflows** (renamed from
"Design Skills for Claude Code" 2026-11-09), live at https://aidesignworkflows.com
(GitHub Pages from `main`/docs, custom domain via `docs/CNAME` since 2026-11-09; the old
kanzariaz.github.io/design-skills/ URL redirects). Keep `docs/CNAME`. `docs/` is the deliverable; rows render client-side
from `docs/skills.json`; Copy buttons copy `npx skills add kanzariaz/design-skills -s <id>`
and prefetch `docs/skills/<id>/SKILL.md`. Keep `docs/.nojekyll`.

## Working agreements

- Funnel: dictate → edit → verify on localhost preview (launch.json `design-skills-site`,
  port 4173) → push on the user's word. Big/risky rounds go on a test branch first.
- The user drives with /queue (append per item, execute on word), /spar, /mock, /park
  (renamed 2026-11-09 from /list-it, /explore, /mock-it, /park-it; the user may still
  have the old names installed locally). Mock before building; when the user says
  "mock", do NOT touch files. Parked decisions live in `docs/parked.md`.
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
  FormData `email_address` + `fields[source]`. No proxy, no keys. Intended setting is
  SINGLE opt-in (user confirmed 2026-11-09) → success copy "You're on the list!". If Kit
  ever has the incentive/confirmation email on, the copy is wrong – turn it off in Kit.
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

## Skills (docs/skills.json)

- Design Exploration: /mock, /spar, /queue, /park (all copy).
- Design Execution: /canvas (soon, not yet specced), /save-rationale (copy),
  /design-eval (soon). save-rationale and design-eval keep their names for now.

## Analytics (TelemetryDeck, live)

pageview{path} · copySkill{skill} · notifyClick{skill} · signupSuccess{source} ·
signupError{kind: invalid|network} · socialClick{platform}. Every signal also carries
`channel` (visit source: `?utm_source=`/`?ref=` tag, else referrer short name –
linkedin, substack, x, google, github – else "direct"; kept per visit in
sessionStorage). Share tagged links. APP_ID is set in docs/analytics.js.

## Rebrand + domain plan

- Brand: AI Design Workflows. Domain `aidesignworkflows.com` is owned (GoDaddy).
- Domain is live: GoDaddy DNS has 4 A records (185.199.108–111.153) + `www` CNAME →
  kanzariaz.github.io; Pages DNS check passed 2026-11-09. Redesign continues on
  `test/ai-design-workflows` (pushes go to `claude/elegant-archimedes-7v80xn`).
- Next: repo rename to `ai-design-workflows` (safe now the custom domain is set), then
  update `REPO` in docs/script.js, README and this file.
- Repo stays public (installs need it); share the site link, README points to the site.
- Redesign direction is parked in `docs/parked.md` (signup-first mockups, Think/Make/Build
  grouping still to mock).

## Open items

- Kit custom field `source` (user-side, 1 min) for source data to persist.
- Confirm in Kit that form 9881799 has the incentive (confirmation) email OFF.
- Favicon slash is a drawn bar, not the true Fraunces glyph — trace the glyph if wanted.
- Kit welcome email still lists /park as coming soon – edit it in Kit (repo copy in
  `emails/welcome.html` is updated).
- Tick "Enforce HTTPS" in Pages settings once the certificate is issued.

Rationale and rejected directions: docs/design-context.md.
