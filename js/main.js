// Punto de entrada: arma la página y conecta los eventos.

let state = loadState();

function refresh(){
  updateView(state);
}

/* ---------- Edición de datos y metas ---------- */

document.addEventListener('input', e => {
  const t = e.target;
  if(t.dataset.k){
    const n = parseFloat(t.value);
    state.inputs[t.dataset.k][t.dataset.key] = isNaN(n) ? 0 : n;
  }else if(t.dataset.meta){
    const n = parseFloat(t.value);
    if(isNaN(n)) return;
    state.metas[t.dataset.meta] = n;
  }else{
    return;
  }
  saveState(state);
  refresh();
});

/* ---------- Copiar fichas y resaltar al navegar ---------- */

document.addEventListener('click', e => {
  const copyBtn = e.target.closest('[data-copy]');
  if(copyBtn){
    const k = KPIS.find(x => x.id === copyBtn.dataset.copy);
    copyText(fichaText(k, state.inputs[k.id], state.metas[k.id]), `Ficha K·${k.id} copiada`);
    return;
  }
  const link = e.target.closest('a[href^="#k"]');
  if(link) flashCard(link.getAttribute('href').slice(1));
});

function flashCard(id){
  const card = document.getElementById(id);
  if(!card) return;
  card.classList.remove('is-flash');
  void card.offsetWidth; // reinicia la animación
  card.classList.add('is-flash');
}
document.addEventListener('animationend', e => {
  if(e.animationName === 'flash') e.target.classList.remove('is-flash');
});

document.getElementById('copy-all').addEventListener('click', () => {
  const text = AREAS.map(a => {
    const fichas = KPIS
      .filter(k => k.area === a.key)
      .map(k => fichaText(k, state.inputs[k.id], state.metas[k.id]));
    return `== ${a.title.toUpperCase()} ==\nProblema detectado: ${a.quote}\n\n${fichas.join('\n\n')}`;
  }).join('\n\n\n');
  copyText(text, `Las ${KPIS.length} fichas se copiaron`);
});

document.getElementById('reset').addEventListener('click', () => {
  if(!confirm('¿Restaurar los datos de ejemplo? Se perderán los números que cambiaste.')) return;
  state = defaultState();
  clearState();
  renderAreas(state);
  refresh();
  toast('Datos de ejemplo restaurados');
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
renderAreas(state);
refresh();
setupNav();
syncThemeButton();
