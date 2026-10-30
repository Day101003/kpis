// Construye la interfaz a partir de data.js y kpi.js.

const ICON_COPY = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';

function renderNav(){
  const links = [
    {id:'entrevista', label:'Entrevista'},
    ...AREAS.map(a => ({id:`area-${a.key}`, label:a.short})),
    {id:'registros', label:'Datos'}
  ];
  document.getElementById('nav-links').innerHTML = links.map(l =>
    `<a class="nav-link" href="#${l.id}">${l.label}</a>`
  ).join('');
}

function renderAreas(){
  document.getElementById('areas').innerHTML = AREAS.map(a => `
    <section class="manual-overview" id="area-${a.key}" aria-labelledby="h-${a.key}">
      <header class="manual-heading">
        <div><div class="eyebrow">Resumen de indicadores</div><h2 id="h-${a.key}">${a.title}</h2></div>
      </header>
      <div class="manual-grid">${KPIS.filter(k => k.area === a.key).map(cardHTML).join('')}</div>
    </section>`).join('');
}

function cardHTML(k){
  const v = kpiValue(k);
  return `
  <article class="card manual-card" id="k${k.id}">
    <h3>${k.name}</h3>
    <div class="manual-gauge">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle class="manual-track" cx="60" cy="60" r="50"/>
        <circle class="manual-arc" cx="60" cy="60" r="50" pathLength="100" stroke-dasharray="${v} ${100 - v}" transform="rotate(-90 60 60)"/>
      </svg>
      <div class="manual-gauge-value"><div class="value"><b>${v === null ? '—' : nf(v, 0)}</b><span>%</span></div><span>Estimación inicial</span></div>
    </div>
    <details class="manual-details"><summary>Acerca del indicador</summary>
      <p class="obj">${k.obj}</p>
      <div class="formula"><small>Fórmula</small>${k.formula}</div>
      <dl class="meta-row"><dt>Frecuencia</dt><dd>${k.freq}</dd><dt>Responsable</dt><dd>${k.resp}</dd><dt>Fuente</dt><dd>${k.fuente}</dd></dl>
      <button class="copy" type="button" data-copy="${k.id}">${ICON_COPY}Copiar ficha</button>
    </details>
  </article>`;
}
