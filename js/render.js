// Construye y actualiza la interfaz a partir de data.js, kpi.js y el estado.

const ICON_COPY = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';
const STATUS_RANK = {none:0, ok:1, warn:2, bad:3};

/* ---------- Estructura (se arma una vez) ---------- */

function renderNav(){
  const links = [
    {id:'resumen', label:'Resumen'},
    ...AREAS.map(a => ({id:`area-${a.key}`, label:a.short, area:a.key})),
    {id:'registros', label:'Datos'}
  ];
  document.getElementById('nav-links').innerHTML = links.map(l =>
    `<a class="nav-link" href="#${l.id}">${l.area ? `<i class="dot" data-nav-dot="${l.area}"></i>` : ''}${l.label}</a>`
  ).join('');
}

function renderAreas(state){
  document.getElementById('areas').innerHTML = AREAS.map((a, i) => {
    const kpis = KPIS.filter(k => k.area === a.key);
    return `
    <section class="area" id="area-${a.key}" aria-labelledby="h-${a.key}">
      <div class="area-head">
        <div class="area-index">Problema ${String(i + 1).padStart(2, '0')}</div>
        <h2 id="h-${a.key}">${a.title}</h2>
        <figure class="quote">
          <blockquote>${a.quote}</blockquote>
          <figcaption>De la entrevista</figcaption>
        </figure>
        <div class="area-count">
          <span>${kpis.length} ${kpis.length === 1 ? 'indicador' : 'indicadores'}</span>
          <span class="area-dots" data-area-dots="${a.key}"></span>
        </div>
      </div>
      <div class="cards">${kpis.map(k => cardHTML(k, state)).join('')}</div>
    </section>`;
  }).join('');
}

function cardHTML(k, state){
  const inputs = state.inputs[k.id];
  const short = unitShort(k.unit);
  return `
  <article class="card" id="k${k.id}" data-status="none">
    <header class="card-top">
      <span class="stamp">K·${k.id}</span>
      <h3>${k.name}</h3>
      <span class="pill none" data-pill>—</span>
    </header>
    <p class="obj">${k.obj}</p>
    <div class="formula"><small>Fórmula</small>${k.formula}</div>
    <div class="inputs${k.inputs.length === 3 ? ' three' : ''}">
      ${k.inputs.map(i => fieldHTML(k, i, inputs[i.key])).join('')}
    </div>
    <div class="result">
      <div class="result-row">
        <div class="value"><b data-val>—</b><span>${unitLong(k.unit)}</span></div>
        <span class="target" data-target></span>
      </div>
      ${meterHTML(k)}
      <div class="scale"><span>${nf(k.min, 0)}</span><span>${nf(k.max, 0)}${short ? ' ' + short : ''}</span></div>
    </div>
    <dl class="meta-row">
      <dt>Meta</dt>${metaHTML(k, state.metas[k.id])}
      <dt>Frecuencia</dt><dd>${k.freq}</dd>
      <dt>Responsable</dt><dd>${k.resp}</dd>
      <dt>Fuente</dt><dd>${k.fuente}</dd>
    </dl>
    <footer class="card-foot">
      <button class="copy" type="button" data-copy="${k.id}">${ICON_COPY}Copiar ficha</button>
    </footer>
  </article>`;
}

function fieldHTML(k, input, value){
  const id = `in-${k.id}-${input.key}`;
  return `
      <div class="field">
        <label for="${id}">${input.label}</label>
        <div class="inbox">${input.prefix ? `<span>${input.prefix}</span>` : ''}<input id="${id}" type="number" inputmode="decimal" min="0" step="any" data-k="${k.id}" data-key="${input.key}" value="${value}"></div>
      </div>`;
}

function metaHTML(k, meta){
  if(k.dir === 'range') return `<dd>${metaText(k, meta)}</dd>`;
  return `<dd><span class="meta-edit">${k.dir === 'up' ? '≥' : '≤'} <input id="meta-${k.id}" type="number" inputmode="decimal" step="any" data-meta="${k.id}" value="${meta}" aria-label="Meta de ${k.name}"> ${unitShort(k.unit)}</span></dd>`;
}

function meterHTML(k){
  const band = k.dir === 'range'
    ? `<div class="band" style="left:${pct(k, k.range[0])}%;width:${pct(k, k.range[1]) - pct(k, k.range[0])}%"></div>`
    : '';
  return `<div class="meter" aria-hidden="true">${band}<div class="fill" data-fill></div><div class="mark" data-mark></div></div>`;
}

/* ---------- Valores (se recalculan con cada cambio) ---------- */

function updateView(state){
  const tally = {ok:0, warn:0, bad:0, none:0};
  const attention = [];
  const byArea = {};

  KPIS.forEach(k => {
    const meta = state.metas[k.id];
    const v = kpiValue(k, state.inputs[k.id]);
    const s = kpiStatus(k, v, meta);

    tally[s]++;
    if(s === 'bad' || s === 'warn') attention.push({k, s});
    (byArea[k.area] ||= []).push(s);

    const card = document.getElementById(`k${k.id}`);
    card.dataset.status = s;
    card.querySelector('[data-val]').textContent = v === null ? '—' : nf(v, k.dec);
    card.querySelector('[data-target]').textContent = 'meta ' + metaText(k, meta).toLowerCase();

    const pill = card.querySelector('[data-pill]');
    pill.className = `pill ${s}`;
    pill.textContent = STATUS_LABEL[s];

    const fill = card.querySelector('[data-fill]');
    fill.className = `fill ${s}`;
    fill.style.width = v === null ? '0%' : `${pct(k, v)}%`;

    const mark = card.querySelector('[data-mark]');
    mark.hidden = k.dir === 'range';
    if(!mark.hidden) mark.style.left = `${pct(k, meta)}%`;
  });

  updateSummary(tally, attention);
  updateAreaDots(byArea);
}

function updateSummary(tally, attention){
  const total = KPIS.length;
  ['ok', 'warn', 'bad'].forEach(s => { document.getElementById(`c-${s}`).textContent = tally[s]; });

  // Anillo: un segmento por estado, con una pequeña separación entre ellos
  const present = ['ok', 'warn', 'bad', 'none'].filter(s => tally[s] > 0);
  const gap = present.length > 1 ? 1.6 : 0;
  let offset = 0;
  ['ok', 'warn', 'bad', 'none'].forEach(s => {
    const seg = document.querySelector(`[data-seg="${s}"]`);
    const len = tally[s] / total * 100;
    const dash = len > 0 ? Math.max(len - gap, 0.5) : 0;
    seg.style.strokeDasharray = `${dash} ${100 - dash}`;
    seg.style.strokeDashoffset = `${-offset}`;
    offset += len;
  });
  document.getElementById('donut-ok').textContent = tally.ok;
  document.getElementById('donut-total').innerHTML = `de ${total}<br>en meta`;
  document.getElementById('donut').setAttribute('aria-label',
    `${tally.ok} de ${total} indicadores en meta, ${tally.warn} cerca y ${tally.bad} fuera de meta`);

  // Chips: primero los que están fuera de meta
  attention.sort((x, y) => STATUS_RANK[y.s] - STATUS_RANK[x.s]);
  document.getElementById('attn').innerHTML = attention.length
    ? attention.map(({k, s}) =>
        `<a class="chip" href="#k${k.id}"><i class="dot ${s}"></i><span class="chip-id">K·${k.id}</span>${k.name}</a>`
      ).join('')
    : '<span class="attn-title">Todos los indicadores están en meta. ✨</span>';
}

function updateAreaDots(byArea){
  Object.entries(byArea).forEach(([area, statuses]) => {
    const worst = statuses.reduce((a, b) => STATUS_RANK[b] > STATUS_RANK[a] ? b : a, 'none');
    document.querySelector(`[data-nav-dot="${area}"]`).className = `dot ${worst}`;
    document.querySelector(`[data-area-dots="${area}"]`).innerHTML =
      statuses.map(s => `<i class="dot ${s}" title="${STATUS_LABEL[s]}"></i>`).join('');
  });
}
