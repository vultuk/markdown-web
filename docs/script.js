(() => {
  function copy(text) {
    try { navigator.clipboard.writeText(text); } catch {}
  }
  document.querySelectorAll('.copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = btn.getAttribute('data-copy') || '';
      copy(c);
      const prev = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = prev), 1200);
    });
  });
  // Mobile nav toggle
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && e.target !== toggle) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
