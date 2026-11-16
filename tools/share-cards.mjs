// Builds the link-preview (Open Graph) cards and the per-skill share pages.
//
//   node tools/share-cards.mjs
//
// Reads docs/skills.json and writes:
//   docs/og/home.png        – card for the main link (aidesignworkflows.com)
//   docs/og/<id>.png        – one 1200×630 card per skill
//   docs/<id>/index.html    – tiny page per skill: names its card for
//                             iMessage/Slack/LinkedIn/X, then sends people on
//                             to the main page at that skill's row (/#<id>)
//
// Re-run whenever a skill is added, renamed or re-described.
// Needs Google Chrome installed (used headless to draw the cards).

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'docs');
const SITE = 'https://aidesignworkflows.com';
const DOMAIN = 'aidesignworkflows.com';
const BRAND = 'AI Design Workflows';
const TAGLINE = 'Bring your design process into Claude Code through these skills. Make Claude work the way designers work.';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const sentenceCase = (s) => s.charAt(0) + s.slice(1).toLowerCase();

// Colors and type mirror the tokens in docs/styles.css :root.
const CARD_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,400,0,1;0,9..144,700,0,1;1,9..144,400,0,1&family=Inter:wght@600&display=block');
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; background: #f4f1ea; }
  body { font-variation-settings: 'SOFT' 0, 'WONK' 0; -webkit-font-smoothing: antialiased;
         display: flex; flex-direction: column; padding: 72px 84px 64px; color: #1f1c17; }
  .label { font: 600 20px/1 Inter, sans-serif; letter-spacing: 0.09em; text-transform: uppercase; color: #6e6658;
           display: flex; align-items: center; gap: 16px; }
  .chip { letter-spacing: 0.04em; text-transform: none; border: 1.5px solid #ddd6c8; border-radius: 10px; padding: 8px 14px; }
  .name { font: 700 104px/1.05 Fraunces, Georgia, serif; margin: 30px 0 22px; letter-spacing: -0.01em; }
  .desc { font: 400 34px/1.38 Fraunces, Georgia, serif; color: #3a352d; max-width: 960px;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .home .name { font-size: 112px; margin: 0 0 30px; }
  .home .desc { font-style: italic; font-size: 38px; max-width: 1032px; }
  .foot { margin-top: auto; padding-top: 26px; border-top: 1.5px solid #ddd6c8;
          display: flex; justify-content: space-between; align-items: baseline; }
  .brand { font: 700 34px/1 Fraunces, Georgia, serif; }
  .url { font: 600 24px/1 Inter, sans-serif; color: #6e6658; }
`;

function skillCard(skill, section) {
  const chip = skill.status === 'soon' ? '<span class="chip">Coming soon</span>' : '';
  return `<!doctype html><meta charset="utf-8"><style>${CARD_CSS}</style>
  <div class="label">${esc(sentenceCase(section))}${chip}</div>
  <div class="name">${esc(skill.name)}</div>
  <div class="desc">${esc(skill.description)}</div>
  <div class="foot"><span class="brand">${BRAND}</span><span class="url">${DOMAIN}/${esc(skill.id)}</span></div>`;
}

function homeCard() {
  return `<!doctype html><meta charset="utf-8"><style>${CARD_CSS}</style>
  <body class="home"><div style="margin-top:auto"></div>
  <div class="name">${BRAND}</div>
  <div class="desc">${esc(TAGLINE)}</div>
  <div class="foot"><span class="brand"></span><span class="url">${DOMAIN}</span></div></body>`;
}

function sharePage(skill) {
  const title = `${skill.name} – ${BRAND}`;
  const url = `${SITE}/${skill.id}/`;
  const img = `${SITE}/og/${skill.id}.png`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(skill.description)}">
  <link rel="canonical" href="${url}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${BRAND}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(skill.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${img}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(skill.name)} – ${BRAND}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${img}">
  <meta http-equiv="refresh" content="0; url=/#${skill.id}">
  <script>location.replace('/' + location.search + '#${skill.id}');</script>
</head>
<body style="background:#f4f1ea">
  <p><a href="/#${skill.id}">${esc(skill.name)} – ${BRAND}</a></p>
</body>
</html>
`;
}

function render(html, outPng) {
  const tmp = join(tmpdir(), `og-${process.pid}-${Math.random().toString(36).slice(2)}.html`);
  writeFileSync(tmp, html);
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1200,630', '--virtual-time-budget=8000',
    `--screenshot=${outPng}`, `file://${tmp}`,
  ], { stdio: 'ignore' });
  rmSync(tmp);
}

const data = JSON.parse(readFileSync(join(DOCS, 'skills.json'), 'utf8'));
mkdirSync(join(DOCS, 'og'), { recursive: true });

render(homeCard(), join(DOCS, 'og', 'home.png'));
console.log('og/home.png');

for (const section of data.sections) {
  for (const skill of section.skills) {
    render(skillCard(skill, section.label), join(DOCS, 'og', `${skill.id}.png`));
    mkdirSync(join(DOCS, skill.id), { recursive: true });
    writeFileSync(join(DOCS, skill.id, 'index.html'), sharePage(skill));
    console.log(`og/${skill.id}.png  ${skill.id}/index.html`);
  }
}
