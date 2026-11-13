// Renders the skill sections from skills.json and wires the copy buttons.
// A "copy" skill's button copies its one-line installer; the hero toast is
// the only click feedback (the button label never changes).

const REPO = 'kanzariaz/ai-design-workflows';

const COPY_ICON = '<svg class="btn__icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.4"></rect><path d="M10.5 3.5V3a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"></path></svg>';

const BELL_ICON = '<svg class="btn__icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12.7 10.8H3.3c.9-.9 1.4-1.6 1.4-4.1 0-1.9 1.4-3.4 3.3-3.4s3.3 1.5 3.3 3.4c0 2.5.5 3.2 1.4 4.1z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.7 13a1.5 1.5 0 0 0 2.6 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"></path></svg>';

const SHARE_ICON = '<svg class="btn__icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 10V2.5M5 5.2 8 2.2l3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.5 7.5H4.2A1.2 1.2 0 0 0 3 8.7v4.6a1.2 1.2 0 0 0 1.2 1.2h7.6a1.2 1.2 0 0 0 1.2-1.2V8.7a1.2 1.2 0 0 0-1.2-1.2h-1.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"></path></svg>';

/* Share: phones open the native share sheet; computers copy a link that
   opens the page right at this skill's row (#skill-id). */
function shareButton(skill) {
  const btn = document.createElement('button');
  btn.className = 'btn btn--share';
  btn.type = 'button';
  btn.title = 'Share';
  btn.setAttribute('aria-label', `Share ${skill.name}`);
  btn.innerHTML = SHARE_ICON;
  btn.addEventListener('click', async () => {
    const url = `${location.origin}${location.pathname}#${skill.id}`;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    if (touch && navigator.share) {
      try {
        await navigator.share({ title: `${skill.name} – AI Design Workflows`, text: skill.description, url });
        window.tdSignal?.('shareSkill', { skill: skill.id, method: 'sheet' });
      } catch { /* closing the share sheet is not an error */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast(`${skill.name} link copied`, 'Send it to anyone – it opens right at this skill.');
      window.tdSignal?.('shareSkill', { skill: skill.id, method: 'link' });
    } catch {
      showToast('Copy failed', 'Try again');
    }
  });
  return btn;
}

// Which skill's Notify Me button brought the visitor to the signup — sent
// with the subscription so launches can be prioritized by real interest.
let signupSource = '';

let toastTimer = null;

function showToast(title, text) {
  const toast = document.getElementById('toast');
  const titleEl = toast.querySelector('.toast__title');
  const textEl = toast.querySelector('.toast__text');

  // The slash gets its own span so the subtext can left-align with the
  // skill name's first letter instead of the slash.
  titleEl.textContent = '';
  let slashWidth = 0;
  if (title.startsWith('/')) {
    const slash = document.createElement('span');
    slash.textContent = '/';
    titleEl.append(slash, document.createTextNode(title.slice(1)));
    slashWidth = slash.offsetWidth;
  } else {
    titleEl.textContent = title;
  }
  textEl.textContent = text;
  textEl.style.marginLeft = `${slashWidth}px`;

  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 8000);
}

function renderRow(skill) {
  const row = document.createElement('article');
  row.className = 'skill-row';
  row.id = skill.id; /* share links land here */

  const name = document.createElement('h3');
  name.className = 'skill-row__name';
  name.textContent = skill.name;

  const desc = document.createElement('p');
  desc.className = 'skill-row__desc';
  desc.textContent = skill.description;

  const action = document.createElement('div');
  action.className = 'skill-row__action';

  if (skill.status === 'copy') {
    const btn = document.createElement('button');
    btn.className = 'btn btn--copy';
    btn.type = 'button';
    btn.innerHTML = COPY_ICON + '<span class="btn__label btn__label--desktop">Copy Skill</span><span class="btn__label btn__label--mobile">Copy</span>';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(`npx skills add ${REPO} -s ${skill.id} -g -a claude-code -y`);
        showToast(`${skill.name} copied`, "Paste it into Claude Code or your terminal, let it run, and you're ready to use it.");
        window.tdSignal?.('copySkill', { skill: skill.id });
      } catch {
        showToast('Copy failed', 'Try again');
      }
    });
    action.appendChild(btn);
  } else {
    row.classList.add('skill-row--soon');
    const chipwrap = document.createElement('span');
    chipwrap.className = 'skill-row__chipwrap';
    const chip = document.createElement('span');
    chip.className = 'skill-row__chip';
    chip.textContent = 'COMING SOON';
    chipwrap.appendChild(chip);
    row.appendChild(chipwrap);

    const btn = document.createElement('button');
    btn.className = 'btn btn--soon btn--notify';
    btn.type = 'button';
    btn.innerHTML = BELL_ICON + '<span class="btn__label btn__label--desktop">Notify Me</span><span class="btn__label btn__label--mobile">Notify</span>';
    btn.addEventListener('click', () => {
      signupSource = skill.id;
      window.tdSignal?.('notifyClick', { skill: skill.id });
      /* go to whichever of the two forms is closer to this button */
      const here = btn.getBoundingClientRect().top;
      const forms = [...document.querySelectorAll('.signup__form')];
      const form = forms.sort((a, b) =>
        Math.abs(a.getBoundingClientRect().top - here) - Math.abs(b.getBoundingClientRect().top - here))[0];
      form?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      /* focusing lights the capsule — its focus state is the arrival cue */
      setTimeout(() => form?.querySelector('.signup__input')?.focus({ preventScroll: true }), 600);
    });
    action.appendChild(btn);
  }

  /* Share joins the main button as one split control */
  const split = document.createElement('div');
  split.className = `btn-split btn-split--${skill.status === 'copy' ? 'primary' : 'secondary'}`;
  split.append(...action.children, shareButton(skill));
  action.appendChild(split);
  row.append(name, desc, action);
  return row;
}

async function init() {
  const res = await fetch('skills.json', { cache: 'no-cache' });
  const data = await res.json();
  const mount = document.getElementById('sections');

  for (const section of data.sections) {
    const el = document.createElement('section');
    el.className = 'skills';

    const label = document.createElement('h2');
    label.className = 'skills__label';
    label.textContent = section.label;

    const table = document.createElement('div');
    table.className = 'skills__table';
    for (const skill of section.skills) table.appendChild(renderRow(skill));

    el.append(label, table);
    mount.appendChild(el);
  }

  /* rows render after load, so the browser's own jump to #skill-id misses – redo it */
  const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  target?.scrollIntoView({ block: 'center' });
}

init();

/* ---- Email signup ---- */
/* Kit (ConvertKit) form endpoint — accepts direct posts from the browser. */
const SIGNUP_ENDPOINT = 'https://app.kit.com/forms/9881799/subscriptions';

/* Two copies of the same form (hero + footer); each runs on its own and
   reports where it was used (placement) with the signup signal. */
document.querySelectorAll('.signup__form').forEach((signupForm) => {
  const placement = signupForm.dataset.placement || 'hero';
  const input = signupForm.querySelector('input[type="email"]');
  const note = signupForm.querySelector('.signup__note');
  const setNote = (text, isError) => {
    note.textContent = text;
    note.classList.toggle('is-error', Boolean(text) && Boolean(isError));
    note.classList.toggle('is-success', Boolean(text) && !isError);
  };

  const submitBtn = signupForm.querySelector('.signup__btn');

  /* Subscribing only disables the button; the field stays editable so a
     visitor can correct or change their email — any edit re-arms the form. */
  const markSubscribed = () => {
    submitBtn.disabled = true;
  };

  input.addEventListener('input', () => {
    if (note.classList.contains('is-error')) setNote('');
    if (submitBtn.disabled) {
      submitBtn.disabled = false;
      setNote('');
    }
  });

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNote('Enter a valid email address', true);
      window.tdSignal?.('signupError', { kind: 'invalid' });
      input.focus();
      return;
    }
    setNote('');
    if (!SIGNUP_ENDPOINT) {
      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        markSubscribed();
        setNote("You're on the list!");
      } else {
        setNote("Signups aren't open quite yet – check back soon.", true);
      }
      return;
    }
    try {
      const body = new FormData();
      body.append('email_address', email);      body.append('fields[source]', signupSource || 'direct');
      const res = await fetch(SIGNUP_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body
      });
      if (!res.ok) throw new Error(String(res.status));
      markSubscribed();
      setNote("You're on the list!");
      window.tdSignal?.('signupSuccess', { source: signupSource || 'direct', placement });
    } catch {
      setNote('Something went wrong – try again in a moment.', true);
      window.tdSignal?.('signupError', { kind: 'network' });
    }
  });
});

/* ---- Social link signals ---- */
document.querySelectorAll('.social').forEach((link) => {
  link.addEventListener('click', () => {
    window.tdSignal?.('socialClick', { platform: link.getAttribute('aria-label') });
  });
});
