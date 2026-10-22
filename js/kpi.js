// Cálculo, formato y semáforo de cada indicador. No toca el DOM.

const STATUS_LABEL = {ok:'En meta', warn:'Cerca', bad:'Fuera de meta', none:'Sin datos'};

function nf(n, dec){
  return n.toLocaleString('es-CR', {minimumFractionDigits:dec, maximumFractionDigits:dec});
}

// Unidad corta para escalas y metas; unidad larga junto al valor grande
function unitShort(unit){
  return {'%':'%', 'min':'min', 'pts':'', 'veces/año':'×'}[unit] ?? unit;
}
function unitLong(unit){
  return unit === 'pts' ? 'puntos' : unit;
}

function kpiValue(k, inputs){
  const v = k.calc(inputs);
  return (v === null || !isFinite(v)) ? null : v;
}

function kpiStatus(k, v, meta){
  if(v === null) return 'none';
  if(k.dir === 'range'){
    const [lo, hi] = k.range, [wlo, whi] = k.warnRange;
    if(v >= lo && v <= hi) return 'ok';
    return (v >= wlo && v <= whi) ? 'warn' : 'bad';
  }
  if(k.dir === 'up') return v >= meta ? 'ok' : v >= meta - k.delta ? 'warn' : 'bad';
  return v <= meta ? 'ok' : v <= meta + k.delta ? 'warn' : 'bad';
}

function metaText(k, meta){
  if(k.dir === 'range') return `Entre ${k.range[0]} y ${k.range[1]}`;
  const unit = k.unit === 'veces/año' ? ' veces al año' : k.unit === 'min' ? ' min' : ' %';
  const dec = (k.dec === 0 || Number.isInteger(meta)) ? 0 : 1;
  return (k.dir === 'up' ? '≥ ' : '≤ ') + nf(meta, dec) + unit;
}

// Posición (0–100 %) de un valor dentro de la barra del indicador
function pct(k, x){
  return Math.max(0, Math.min(100, (x - k.min) / (k.max - k.min) * 100));
}

// Ficha en texto plano, lista para pegar en el informe
function fichaText(k, inputs, meta){
  const v = kpiValue(k, inputs);
  const datos = k.inputs.map(i => `  - ${i.label}: ${i.prefix || ''}${nf(inputs[i.key] || 0, 0)}`).join('\n');
  const actual = v === null ? 'sin datos' : `${nf(v, k.dec)} ${unitLong(k.unit)}`;
  return [
    `K·${k.id} ${k.name}`,
    `Objetivo: ${k.obj}`,
    `Fórmula: ${k.formula}`,
    `Unidad: ${k.unit === 'pts' ? 'puntos (índice)' : k.unit}`,
    ...(!k.fixed ? [`Meta: ${metaText(k, meta)}`] : []),
    `Frecuencia: ${k.freq}`,
    `Responsable: ${k.resp}`,
    `Fuente del dato: ${k.fuente}`,
    `Datos usados:`,
    datos,
    k.fixed ? `Estimación inicial: ${actual} (no es una medición real)` : `Valor actual: ${actual} (${STATUS_LABEL[kpiStatus(k, v, meta)]})`
  ].join('\n');
}
