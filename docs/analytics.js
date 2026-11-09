// TelemetryDeck (privacy-first, cookieless). Sends a pageview on load and
// exposes window.tdSignal for custom signals (used by the Copy Skill buttons).
// Every signal carries `channel`: where this visit came from (see visitChannel).
import TelemetryDeck from 'https://cdn.jsdelivr.net/npm/@telemetrydeck/sdk/+esm';

const APP_ID = 'D058535D-9CE8-4B56-909C-92C02B4841AE'; // TelemetryDeck App ID

// Where the visit came from, in order of trust:
// 1. a tag on the shared link (?utm_source=linkedin or ?ref=linkedin),
// 2. the referring site, reduced to a short name,
// 3. "direct" (typed, bookmarked, or the app hid the referrer).
// Kept for the whole visit so a signup after a click still credits the source.
const KNOWN = [
  [/(^|\.)(linkedin\.com|lnkd\.in)$|^com\.linkedin\./, 'linkedin'],
  [/(^|\.)substack\.com$/, 'substack'],
  [/(^|\.)(x\.com|twitter\.com|t\.co)$/, 'x'],
  [/(^|\.)google\./, 'google'],
  [/(^|\.)github\.com$/, 'github'],
];

function visitChannel() {
  try {
    const saved = sessionStorage.getItem('td-channel');
    if (saved) return saved;
  } catch {}

  const params = new URLSearchParams(location.search);
  let channel = (params.get('utm_source') || params.get('ref') || '').trim().toLowerCase();

  if (!channel && document.referrer) {
    try {
      const host = new URL(document.referrer).hostname.replace(/^www\./, '');
      if (host && host !== location.hostname) {
        channel = KNOWN.find(([re]) => re.test(host))?.[1] || host;
      }
    } catch {}
  }

  channel = (channel || 'direct').slice(0, 60);
  try { sessionStorage.setItem('td-channel', channel); } catch {}
  return channel;
}

const channel = visitChannel();

let td = null;

if (APP_ID) {
  let user = null;
  try {
    user = localStorage.getItem('td-user');
    if (!user) {
      user = crypto.randomUUID();
      localStorage.setItem('td-user', user);
    }
  } catch {
    user = crypto.randomUUID();
  }
  td = new TelemetryDeck({ appID: APP_ID, clientUser: user });
  td.signal('pageview', { path: location.pathname, channel });
}

window.tdSignal = (type, payload) => {
  if (td) td.signal(type, { ...payload, channel }).catch(() => {});
};
