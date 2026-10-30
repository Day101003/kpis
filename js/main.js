// Punto de entrada: arma la página y conecta los eventos.

/* ---------- Copiar fichas ---------- */

document.addEventListener('click', e => {
  const copyBtn = e.target.closest('[data-copy]');
  if(copyBtn){
    const k = KPIS.find(x => x.id === copyBtn.dataset.copy);
    copyText(fichaText(k), `Ficha K·${k.id} copiada`);
  }
});

/* ---------- Tema ---------- */

function syncThemeButton(){
  const btn = document.getElementById('theme-toggle');
  const mode = currentTheme();
  btn.dataset.mode = mode;
  btn.setAttribute('aria-label', mode === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
}
document.getElementById('theme-toggle').addEventListener('click', () => {
  toggleTheme();
  syncThemeButton();
});
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeButton);

/* ---------- Navegación: sombra al bajar y sección activa ---------- */

function setupNav(){
  const nav = document.getElementById('nav');
  const linksBox = document.getElementById('nav-links');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  if(!('IntersectionObserver' in window)) return;
  const links = new Map([...linksBox.querySelectorAll('.nav-link')].map(a => [a.getAttribute('href').slice(1), a]));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      links.forEach(a => a.classList.remove('is-active'));
      const active = links.get(entry.target.id);
      if(!active) return;
      active.classList.add('is-active');
      // En pantallas chicas, deja visible el enlace activo dentro de la barra
      if(linksBox.scrollWidth > linksBox.clientWidth){
        linksBox.scrollTo({left:active.offsetLeft - (linksBox.clientWidth - active.offsetWidth) / 2, behavior:'smooth'});
      }
    });
  }, {rootMargin:'-40% 0px -55% 0px'});

  links.forEach((_, id) => {
    const section = document.getElementById(id);
    if(section) observer.observe(section);
  });
}

/* ---------- Inicio ---------- */

renderNav();
renderAreas();
setupNav();
syncThemeButton();
