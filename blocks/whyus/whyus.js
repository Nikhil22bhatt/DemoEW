/*
 * Why Us block — stat items arranged on a dotted arc around a central image.
 * Authoring: each row is one stat, cells: [icon-name] [number] [label] [optional link].
 * A row whose first cell is a picture becomes the central illustration.
 */

const ICONS = {
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  smile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M9 12l2 2 4-4"/></svg>',
  garage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-5 9 5"/><path d="M4 10v10h16V10"/><path d="M7 20v-4a5 5 0 0 1 10 0v4"/><circle cx="12" cy="15" r="1"/></svg>',
  hospital: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="7" width="16" height="14" rx="1"/><path d="M9 7V4h6v3"/><path d="M12 11v4M10 13h4"/></svg>',
  location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><path d="M9 10l2 2 4-4"/></svg>',
};

export default function decorate(block) {
  const rows = [...block.children];
  let centerPic = null;
  const items = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    const pic = row.querySelector('picture');
    if (pic && cells.length === 1) {
      centerPic = pic;
      return;
    }
    const iconKey = (cells[0]?.textContent || '').trim().toLowerCase();
    const number = (cells[1]?.textContent || '').trim();
    const label = (cells[2]?.textContent || '').trim();
    const link = cells[3]?.querySelector('a');
    if (number || label) items.push({ iconKey, number, label, link });
  });

  block.textContent = '';

  const stage = document.createElement('div');
  stage.className = 'whyus-stage';

  if (centerPic) {
    const center = document.createElement('div');
    center.className = 'whyus-center';
    center.append(centerPic);
    stage.append(center);
  }

  const list = document.createElement('ul');
  list.className = 'whyus-items';

  items.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'whyus-item';
    li.style.setProperty('--i', i);

    const icon = document.createElement('span');
    icon.className = 'whyus-icon';
    icon.innerHTML = ICONS[item.iconKey] || ICONS.shield;

    const num = document.createElement('p');
    num.className = 'whyus-number';
    num.textContent = item.number;

    const label = document.createElement('p');
    label.className = 'whyus-label';
    label.textContent = item.label;

    li.append(icon, num, label);

    if (item.link) {
      const a = document.createElement('a');
      a.className = 'whyus-link';
      a.href = item.link.getAttribute('href') || '#';
      a.textContent = item.link.textContent.trim();
      li.append(a);
    }
    list.append(li);
  });

  stage.append(list);
  block.append(stage);
}
