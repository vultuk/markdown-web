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
})();

