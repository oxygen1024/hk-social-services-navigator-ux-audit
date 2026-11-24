// Keep the directory links available if scripting is disabled.
(() => {
  const nav = document.querySelector('.topnav');
  const tabs = [...nav.querySelectorAll('button[aria-controls]')];
  const field = nav.querySelector('#service-query');
  const list = nav.querySelector('#service-matches');
  const status = nav.querySelector('#service-count');
  const panel = tab => document.getElementById(tab.getAttribute('aria-controls'));
  let active = null;

  function close(restoreFocus = false) {
    if (!active) return;
    active.setAttribute('aria-expanded', 'false');
    panel(active).hidden = true;
    if (restoreFocus) active.focus();
    active = null;
  }

  for (const tab of tabs) {
    panel(tab).hidden = true;
    tab.hidden = false;
    tab.addEventListener('click', () => {
      const wasOpen = tab === active;
      close();
      if (wasOpen) return;
      active = tab;
      panel(tab).hidden = false;
      tab.setAttribute('aria-expanded', 'true');
      if (panel(tab).contains(field)) field.focus();
    });
  }
  nav.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) {
      event.preventDefault();
      close(true);
    }
  });
  nav.addEventListener('click', event => {
    const a = event.target.closest('a');
    if (!a || !a.hash || a.pathname !== location.pathname || a.search !== location.search) return;
    const target = document.getElementById(a.hash.slice(1));
    if (target) {
      close();
      target.tabIndex = -1;
      target.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target)) close();
  });

  const categories = Object.fromEntries(CATEGORIES);
  const norm = value => value.normalize('NFKC').trim().toLowerCase();
  field.addEventListener('input', () => {
    const q = norm(field.value);
    list.replaceChildren();
    status.textContent = '';
    if (!q) return;
    const matches = SERVICES.filter(s => [s.name, s.en || '', ...(s.alias || []), categories[s.cat]]
      .some(value => norm(value).includes(q)));
    status.textContent = matches.length ? '找到 ' + matches.length + ' 項服務' : '未找到相關服務。請試用較短的名稱，或瀏覽所有服務。';
    for (const service of matches) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = 'service.html?id=' + encodeURIComponent(service.id);
      link.textContent = service.name;
      item.append(link);
      list.append(item);
    }
  });
})();
