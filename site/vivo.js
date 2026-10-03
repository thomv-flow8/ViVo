// ViVo — mobiel menu (openen/sluiten, Escape, focus terug naar de knop)
(() => {
  const menu = document.getElementById('menu');
  const open = document.querySelector('.kop .menuknop');
  if (!menu || !open) return;
  const zet = (aan) => {
    menu.classList.toggle('open', aan);
    open.setAttribute('aria-expanded', String(aan));
    document.documentElement.style.overflow = aan ? 'hidden' : '';
    if (aan) menu.querySelector('[data-sluit]')?.focus();
    else open.focus();
  };
  open.addEventListener('click', () => zet(true));
  menu.querySelectorAll('[data-sluit]').forEach(el => el.addEventListener('click', () => zet(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) zet(false); });
})();
