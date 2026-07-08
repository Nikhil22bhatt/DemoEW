/*
 * Quote block — insurance product selector with a registration-number entry.
 * Authoring (one row per line): heading text, then optional product rows and
 * action links. The block is resilient to missing rows and renders a default
 * Car/Bike/Health/Travel set when none are authored.
 */

const ICONS = {
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11"/><path d="M3 11h18v5a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="14.5" r="1"/><circle cx="16.5" cy="14.5" r="1"/></svg>',
  bike: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5l4-7h5l-3 7"/><path d="M9.5 9.5h4l2 3"/><path d="M13 6h3"/></svg>',
  health: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.5-9-9a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c-2 4.5-9 9-9 9z"/><path d="M9 11h2V9h2v2h2"/></svg>',
  travel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 16l20-6-3-2-6 1-5-5-2 1 3 5-4 1-2-2-1 1z"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg>',
  renew: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
};

const PRODUCTS = [
  { key: 'car', label: 'Car' },
  { key: 'bike', label: 'Bike' },
  { key: 'health', label: 'Health' },
  { key: 'travel', label: 'Travel' },
  { key: 'more', label: 'More' },
];

const COPY = {
  car: { heading: 'Get comprehensive car insurance', label: 'Your car registration number', placeholder: 'E.g. KA01AB1234' },
  bike: { heading: 'Get two-wheeler insurance', label: 'Your bike registration number', placeholder: 'E.g. KA01AB1234' },
  health: { heading: 'Get health insurance for your family', label: 'Your mobile number', placeholder: 'E.g. 98765 43210' },
  travel: { heading: 'Get travel insurance for your trip', label: 'Your mobile number', placeholder: 'E.g. 98765 43210' },
  more: { heading: 'Explore all insurance products', label: 'Your mobile number', placeholder: 'E.g. 98765 43210' },
};

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  });
  children.forEach((c) => node.append(c));
  return node;
}

export default function decorate(block) {
  // Read authored action links (e.g. Renew / Insure new car) from the block rows.
  const actions = [...block.querySelectorAll('a')].map((a) => ({
    href: a.getAttribute('href') || '#',
    text: (a.textContent || '').trim(),
  }));

  block.textContent = '';

  // --- Product tabs ---
  const tablist = el('div', { class: 'quote-tabs', role: 'tablist', 'aria-label': 'Insurance products' });
  const tabs = PRODUCTS.map((p, i) => {
    const tab = el(
      'button',
      {
        class: 'quote-tab',
        type: 'button',
        role: 'tab',
        id: `quote-tab-${p.key}`,
        'aria-selected': i === 0 ? 'true' : 'false',
        'aria-controls': 'quote-panel',
        tabindex: i === 0 ? '0' : '-1',
      },
      el('span', { class: 'quote-tab-icon', html: ICONS[p.key] }),
      el('span', { class: 'quote-tab-label' }, document.createTextNode(p.label)),
    );
    return tab;
  });
  tabs.forEach((t) => tablist.append(t));

  // --- Quote panel (heading + input + CTA) ---
  const heading = el('h2', { class: 'quote-heading' });
  const inputLabel = el('label', { class: 'quote-input-label', for: 'quote-input' });
  const input = el('input', {
    class: 'quote-input', id: 'quote-input', type: 'text', autocomplete: 'off', spellcheck: 'false',
  });
  const cta = el('button', { class: 'quote-cta button', type: 'button' }, document.createTextNode('Get Price'));

  const field = el('div', { class: 'quote-field' }, inputLabel, input);
  const panel = el(
    'div',
    { class: 'quote-panel', id: 'quote-panel', role: 'tabpanel', 'aria-labelledby': 'quote-tab-car' },
    heading,
    field,
    cta,
  );

  function applyProduct(key) {
    const c = COPY[key] || COPY.car;
    heading.textContent = c.heading;
    inputLabel.textContent = c.label;
    input.setAttribute('placeholder', c.placeholder);
    input.setAttribute('aria-label', c.label);
    input.value = '';
  }
  applyProduct('car');

  function selectTab(index) {
    tabs.forEach((t, i) => {
      const selected = i === index;
      t.setAttribute('aria-selected', selected ? 'true' : 'false');
      t.setAttribute('tabindex', selected ? '0' : '-1');
      t.classList.toggle('is-active', selected);
    });
    panel.setAttribute('aria-labelledby', tabs[index].id);
    applyProduct(PRODUCTS[index].key);
  }
  selectTab(0);

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => { selectTab(i); tabs[i].focus(); });
    tab.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (next !== null) { e.preventDefault(); selectTab(next); tabs[next].focus(); }
    });
  });

  cta.addEventListener('click', () => {
    // No backend integration; guide the user without a broken submit.
    if (!input.value.trim()) { input.focus(); input.classList.add('is-empty'); return; }
    input.classList.remove('is-empty');
    cta.textContent = 'Getting your price…';
    cta.disabled = true;
  });
  input.addEventListener('input', () => input.classList.remove('is-empty'));

  // --- Action links (Renew / Insure new car) ---
  const actionsWrap = el('div', { class: 'quote-actions' });
  actions.forEach((a, i) => {
    const iconKey = i === 0 ? 'renew' : 'car';
    const link = el(
      'a',
      { class: 'quote-action', href: a.href },
      el('span', { class: 'quote-action-icon', html: ICONS[iconKey] }),
      el('span', { class: 'quote-action-text' }, document.createTextNode(a.text)),
      el('span', { class: 'quote-action-arrow', html: ICONS.arrow }),
    );
    actionsWrap.append(link);
  });

  block.append(tablist, panel);
  if (actions.length) block.append(actionsWrap);
}
