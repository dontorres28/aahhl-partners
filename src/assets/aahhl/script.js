/* ═══ CONSTANTS ════════════════════════════════════════ */
const EMAILS = [
  'julian@staxsports.ch',
  'benjaminchubbs@gmail.com',
  'federico.dolan@pwc.com'
];

const TIERS = {
  t1: {
    en: { num:'Tier 01', name:'Founding Partner', sub:'Maximum 2 positions · 3-Year Minimum Commitment',
          ph:'Tell us about your brand and what interests you about the Founding Partner tier...',
          send:'Send Message', ok_head:'Message sent.', ok_body:'The partnership team will be in touch within 48 hours.' },
    es: { num:'Tier 01', name:'Socio Fundador', sub:'Máximo 2 posiciones · Compromiso Mínimo 3 Años',
          ph:'Cuéntenos sobre su marca y qué le interesa del nivel Socio Fundador...',
          send:'Enviar Mensaje', ok_head:'Mensaje enviado.', ok_body:'El equipo de alianzas se pondrá en contacto en 48 horas.' }
  },
  t2: {
    en: { num:'Tier 02', name:'Official Partner', sub:'4–6 positions · 2-Year Minimum Commitment',
          ph:'Tell us about your brand and what interests you about the Official Partner tier...',
          send:'Send Message', ok_head:'Message sent.', ok_body:'The partnership team will be in touch within 48 hours.' },
    es: { num:'Tier 02', name:'Socio Oficial', sub:'4–6 posiciones · Compromiso Mínimo 2 Años',
          ph:'Cuéntenos sobre su marca y qué le interesa del nivel Socio Oficial...',
          send:'Enviar Mensaje', ok_head:'Mensaje enviado.', ok_body:'El equipo de alianzas se pondrá en contacto en 48 horas.' }
  },
  t3: {
    en: { num:'Tier 03', name:'Federation Supplier', sub:'Open positions · Annual Commitment',
          ph:'Tell us about your brand and what you can offer as a Federation Supplier...',
          send:'Send Message', ok_head:'Message sent.', ok_body:'The partnership team will be in touch within 48 hours.' },
    es: { num:'Tier 03', name:'Proveedor Oficial', sub:'Posiciones abiertas · Compromiso Anual',
          ph:'Cuéntenos sobre su marca y qué puede ofrecer como Proveedor Oficial...',
          send:'Enviar Mensaje', ok_head:'Mensaje enviado.', ok_body:'El equipo de alianzas se pondrá en contacto en 48 horas.' }
  },
  t4: {
    en: { num:'Tier 04', name:'Community Partner', sub:'Open positions · Flexible Terms',
          ph:'Tell us about your brand and your interest in community partnership...',
          send:'Send Message', ok_head:'Message sent.', ok_body:'The partnership team will be in touch within 48 hours.' },
    es: { num:'Tier 04', name:'Socio Comunitario', sub:'Posiciones abiertas · Condiciones Flexibles',
          ph:'Cuéntenos sobre su marca y su interés en una alianza comunitaria...',
          send:'Enviar Mensaje', ok_head:'Mensaje enviado.', ok_body:'El equipo de alianzas se pondrá en contacto en 48 horas.' }
  },
  t5: {
    en: { num:'Tier 05', name:'Player Patron', sub:'One brand per player · Annual Commitment',
          ph:'Tell us about your brand and which player or position you would like to patron ("Presented by")...',
          send:'Send Message', ok_head:'Message sent.', ok_body:'The partnership team will be in touch within 48 hours.' },
    es: { num:'Tier 05', name:'Mecenas de Jugador', sub:'Una marca por jugador · Compromiso Anual',
          ph:'Cuéntenos sobre su marca y qué jugador o posición le gustaría apadrinar ("Presentado por")...',
          send:'Enviar Mensaje', ok_head:'Mensaje enviado.', ok_body:'El equipo de alianzas se pondrá en contacto en 48 horas.' }
  }
};

/* ═══ STATE ════════════════════════════════════════════ */
let lang = 'en';
let currentTier = 't1';

/* ═══ NAV ══════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 20);
}, {passive: true});

/* ═══ REVEAL ═══════════════════════════════════════════ */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('on');
    e.target.querySelectorAll('.bar-f[data-w]').forEach(b =>
      setTimeout(() => b.style.width = b.dataset.w + '%', 200)
    );
  });
}, {threshold: 0.07});
document.querySelectorAll('.r, .rf').forEach(el => io.observe(el));

/* ═══ MODAL ════════════════════════════════════════════ */
function openModal(tier) {
  currentTier = tier;
  const d = TIERS[tier][lang];
  document.getElementById('m-num').textContent = d.num;
  document.getElementById('m-name').textContent = d.name;
  document.getElementById('m-sub').textContent = d.sub;
  document.getElementById('mi-ms').placeholder = d.ph;
  document.getElementById('m-send-txt').textContent = d.send;
  // reset form
  document.getElementById('m-form').reset();
  document.getElementById('m-form').style.display = '';
  document.getElementById('m-ok').classList.remove('show');
  const btn = document.getElementById('m-send');
  btn.classList.remove('sending');
  btn.disabled = false;
  // open
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e.target === document.getElementById('modal')) closeModalDirect();
}
function closeModalDirect() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModalDirect();
});

/* ═══ SEND EMAIL — mailto multi-recipient ══════════════ */
function buildMailtoLink(firstName, lastName, email, company, message, tier) {
  const to = EMAILS.join(',');
  const d  = TIERS[tier][lang];
  const subject = encodeURIComponent(`[AAHHL Partnership] ${d.name} Inquiry from ${company}`);
  const body = encodeURIComponent(
    `Partnership Tier: ${d.name} (${d.num})\n` +
    `Name: ${firstName} ${lastName}\n` +
    `Email: ${email}\n` +
    `Company: ${company}\n\n` +
    `Message:\n${message}\n\n` +
    `---\nSent from aahhl.com partnership form`
  );
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

function sendModal(e) {
  e.preventDefault();
  const fn = document.getElementById('mi-fn').value.trim();
  const ln = document.getElementById('mi-ln').value.trim();
  const em = document.getElementById('mi-em').value.trim();
  const co = document.getElementById('mi-co').value.trim();
  const ms = document.getElementById('mi-ms').value.trim();
  if (!fn || !ln || !em || !co || !ms) return;

  const btn = document.getElementById('m-send');
  btn.classList.add('sending');
  btn.disabled = true;

  // Open mailto — sends to all three
  const mailto = buildMailtoLink(fn, ln, em, co, ms, currentTier);
  window.location.href = mailto;

  // Show success after short delay
  setTimeout(() => {
    const d = TIERS[currentTier][lang];
    document.getElementById('m-form').style.display = 'none';
    const ok = document.getElementById('m-ok');
    document.querySelector('.m-ok-head').textContent = d.ok_head;
    document.querySelector('.m-ok-body').textContent = d.ok_body;
    ok.classList.add('show');
  }, 800);
}

function sendContact(e) {
  e.preventDefault();
  const fn = document.getElementById('cfi-fn').value.trim();
  const ln = document.getElementById('cfi-ln').value.trim();
  const em = document.getElementById('cfi-em').value.trim();
  const co = document.getElementById('cfi-co').value.trim();
  const ms = (lang === 'en'
    ? document.getElementById('cft-en')
    : document.getElementById('cft-es')).value.trim();
  if (!fn || !ln || !em || !co) return;

  const btn = document.getElementById('c-sub');
  btn.classList.add('sending');
  btn.disabled = true;

  const to = EMAILS.join(',');
  const subject = encodeURIComponent(`[AAHHL Partnership Inquiry] ${co} / ${fn} ${ln}`);
  const body = encodeURIComponent(
    `Name: ${fn} ${ln}\nEmail: ${em}\nCompany: ${co}\n\nMessage:\n${ms}\n\n---\nSent from aahhl.com`
  );
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

  setTimeout(() => {
    document.getElementById('c-form-el').style.display = 'none';
    const ok = document.getElementById('c-ok');
    ok.classList.add('on');
  }, 800);
}

/* ═══ LANGUAGE ═════════════════════════════════════════ */
function applyLang(l) {
  lang = l;
  document.querySelectorAll('[data-en]').forEach(el => {
    const v = el.getAttribute('data-' + l);
    if (v === null) return;
    if (el.tagName === 'TEXTAREA') { el.placeholder = v; return; }
    // skip close button
    if (el.classList.contains('m-close')) return;
    el.innerHTML = v;
  });
  // textarea swap
  const en = document.getElementById('cft-en');
  const es = document.getElementById('cft-es');
  if (en) en.style.display = l === 'en' ? 'block' : 'none';
  if (es) es.style.display = l === 'es' ? 'block' : 'none';
  // lang buttons
  document.getElementById('b-en').classList.toggle('on', l === 'en');
  document.getElementById('b-es').classList.toggle('on', l === 'es');
}
function setLang(l) { applyLang(l); }

/* ═══ INIT ══════════════════════════════════════════════ */
window.addEventListener('load', () => {
  const hr = document.getElementById('hero-r');
  if (hr) setTimeout(() => hr.classList.add('loaded'), 100);
});

document.addEventListener('DOMContentLoaded', () => {
  applyLang('en');
  document.querySelectorAll('.bar-f[data-w]').forEach(b => {
    if (b.getBoundingClientRect().top < window.innerHeight)
      b.style.width = b.dataset.w + '%';
  });
});
